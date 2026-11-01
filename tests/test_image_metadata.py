import json
import unittest
from fractions import Fraction
from io import BytesIO
from unittest.mock import patch

import httpx
from PIL import ExifTags, Image

import app
import utils


class FakeExif(dict):
    def __init__(self, gps=None, **values):
        super().__init__(values)
        self.gps = gps or {}

    def get_ifd(self, _tag):
        return self.gps


class FakeImage:
    def __init__(self, exif):
        self.exif = exif

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def getexif(self):
        return self.exif


class ImageMetadataTests(unittest.TestCase):
    def test_extracts_gps_and_timestamp_from_real_pillow_exif(self):
        image = Image.new("RGB", (100, 100), "#4682b4")
        exif = Image.Exif()
        exif[36867] = "2026:11:01 11:58:00"
        exif[36881] = "-05:00"
        exif[34853] = {
            1: "N",
            2: (Fraction(29), Fraction(57), Fraction(99, 25)),
            3: "W",
            4: (Fraction(90), Fraction(4), Fraction(87, 5)),
        }
        buffer = BytesIO()
        image.save(buffer, format="JPEG", exif=exif)

        metadata = utils.extract_image_metadata(buffer.getvalue())

        self.assertAlmostEqual(metadata["latitude"], 29.9511, places=5)
        self.assertAlmostEqual(metadata["longitude"], -90.0715, places=5)
        self.assertEqual(metadata["captured_at"], "2026-11-01T11:58:00-05:00")
        self.assertTrue(metadata["capture_time_timezone_known"])

    def test_extracts_signed_gps_and_capture_time_with_offset(self):
        gps = {
            ExifTags.GPSTAGS[1]: "S",
            ExifTags.GPSTAGS[2]: ((37, 1), (48, 1), (30, 1)),
            ExifTags.GPSTAGS[3]: "W",
            ExifTags.GPSTAGS[4]: ((122, 1), (24, 1), (15, 1)),
        }
        exif = FakeExif(
            gps,
            **{
                ExifTags.TAGS[36867]: "2026:11:01 12:34:56",
                ExifTags.TAGS[36881]: "-07:00",
            },
        )
        with patch.object(utils.Image, "open", return_value=FakeImage(exif)):
            metadata = utils.extract_image_metadata(b"image")

        self.assertAlmostEqual(metadata["latitude"], -37.8083333, places=6)
        self.assertAlmostEqual(metadata["longitude"], -122.4041667, places=6)
        self.assertEqual(metadata["captured_at"], "2026-11-01T12:34:56-07:00")
        self.assertTrue(metadata["capture_time_timezone_known"])

    def test_missing_or_invalid_exif_returns_empty_metadata(self):
        with patch.object(utils.Image, "open", return_value=FakeImage(FakeExif())):
            missing = utils.extract_image_metadata(b"image")
        self.assertIsNone(missing["latitude"])
        self.assertIsNone(missing["longitude"])
        self.assertIsNone(missing["captured_at"])

        invalid_gps = {
            ExifTags.GPSTAGS[1]: "Q",
            ExifTags.GPSTAGS[2]: ((91, 1), (0, 1), (0, 1)),
            ExifTags.GPSTAGS[3]: "W",
            ExifTags.GPSTAGS[4]: ((122, 1), (0, 1), (0, 1)),
        }
        with patch.object(
            utils.Image, "open", return_value=FakeImage(FakeExif(invalid_gps))
        ):
            invalid = utils.extract_image_metadata(b"image")
        self.assertIsNone(invalid["latitude"])
        self.assertIsNone(invalid["longitude"])

    def test_extracts_utc_timestamp_from_gps_date_and_time(self):
        gps = {
            ExifTags.GPSTAGS[7]: ((12, 1), (34, 1), (56, 1)),
            ExifTags.GPSTAGS[29]: "2026:11:01",
        }
        with patch.object(
            utils.Image, "open", return_value=FakeImage(FakeExif(gps))
        ):
            metadata = utils.extract_image_metadata(b"image")

        self.assertEqual(metadata["captured_at"], "2026-11-01T12:34:56+00:00")
        self.assertTrue(metadata["capture_time_timezone_known"])

    def test_session_pin_requires_exif_coordinates(self):
        vision = {
            "target_label": "Water_Disaster",
            "target_category": "Flooding and water-related hazards",
            "image_only_estimate_pct": 35.0,
        }
        no_gps = {"latitude": None, "longitude": None, "captured_at": None}
        self.assertIsNone(app._make_crisis_map_pin(no_gps, vision, "hash"))

        with_gps = {
            "latitude": 12.5,
            "longitude": -45.2,
            "captured_at": "2026-11-01T12:34:56",
            "capture_time_timezone_known": False,
        }
        pin = app._make_crisis_map_pin(with_gps, vision, "hash")
        self.assertEqual(pin["latitude"], 12.5)
        self.assertEqual(pin["longitude"], -45.2)
        self.assertEqual(pin["category"], "Flooding and water-related hazards")
        self.assertEqual(pin["captured_at"], "2026-11-01T12:34:56")

    def test_map_pin_store_deduplicates_an_image_in_session_state(self):
        state = {}
        metadata = {
            "latitude": 12.5,
            "longitude": -45.2,
            "captured_at": None,
            "capture_time_timezone_known": False,
        }
        vision = {
            "target_label": "Water_Disaster",
            "target_category": "Flooding and water-related hazards",
        }
        with patch.object(app.st, "session_state", state):
            self.assertTrue(app._store_crisis_map_pin(metadata, vision, "same-image"))
            self.assertTrue(app._store_crisis_map_pin(metadata, vision, "same-image"))

        self.assertEqual(len(state["crisis_map_pins"]), 1)

    def test_ip_lookup_parses_valid_coordinates_and_does_not_store_ip(self):
        response = httpx.Response(
            200,
            json={"latitude": 41.25, "longitude": -72.5, "ip": "198.51.100.10"},
            request=httpx.Request("GET", "https://ipapi.co/json/"),
        )
        with patch.object(utils.httpx, "get", return_value=response) as get:
            coordinates = utils.fetch_ip_coordinates()

        self.assertEqual(coordinates, {"latitude": 41.25, "longitude": -72.5})
        get.assert_called_once()

    def test_ip_lookup_rejects_invalid_coordinates(self):
        invalid_response = httpx.Response(
            200,
            json={"latitude": 91, "longitude": 0},
            request=httpx.Request("GET", "https://ipapi.co/json/"),
        )
        fallback_response = httpx.Response(
            200,
            json={"success": True, "latitude": 91, "longitude": 0},
            request=httpx.Request("GET", "https://ipwho.is/"),
        )
        with patch.object(
            utils.httpx,
            "get",
            side_effect=(invalid_response, fallback_response),
        ):
            with self.assertRaises(utils.IPGeolocationError):
                utils.fetch_ip_coordinates()

    def test_ip_lookup_falls_back_when_primary_provider_fails(self):
        fallback_response = httpx.Response(
            200,
            json={"success": True, "latitude": 41.25, "longitude": -72.5},
            request=httpx.Request("GET", "https://ipwho.is/"),
        )
        with patch.object(
            utils.httpx,
            "get",
            side_effect=(
                httpx.ConnectError("provider unavailable"),
                fallback_response,
            ),
        ) as get:
            coordinates = utils.fetch_ip_coordinates()

        self.assertEqual(coordinates, {"latitude": 41.25, "longitude": -72.5})
        self.assertEqual(
            [call.args[0] for call in get.call_args_list],
            ["https://ipapi.co/json/", "https://ipwho.is/"],
        )

    def test_location_resolution_requires_consent_and_manual_confirmation(self):
        empty_metadata = {
            "latitude": None,
            "longitude": None,
            "captured_at": None,
        }
        with patch.object(
            app, "fetch_ip_coordinates", side_effect=AssertionError("no consent")
        ):
            no_consent = app._resolve_photo_location(
                empty_metadata,
                "Approximate current network location (IP)",
                False,
                False,
                None,
                None,
            )
        self.assertIsNone(no_consent["latitude"])

        with patch.object(
            app,
            "fetch_ip_coordinates",
            return_value={"latitude": 5.5, "longitude": -2.25},
        ) as lookup:
            ip_location = app._resolve_photo_location(
                empty_metadata,
                "Approximate current network location (IP)",
                True,
                False,
                None,
                None,
            )
        lookup.assert_called_once()
        self.assertEqual(ip_location["location_source"], "ip")
        self.assertEqual(ip_location["latitude"], 5.5)

        unconfirmed_manual = app._resolve_photo_location(
            empty_metadata,
            "Enter coordinates manually",
            False,
            False,
            12.5,
            45.5,
        )
        self.assertIsNone(unconfirmed_manual["latitude"])
        manual_location = app._resolve_photo_location(
            empty_metadata,
            "Enter coordinates manually",
            False,
            True,
            12.5,
            45.5,
        )
        self.assertEqual(manual_location["location_source"], "manual")
        self.assertEqual(manual_location["longitude"], 45.5)

    def test_map_renderer_builds_a_pickable_category_layer(self):
        state = {
            "crisis_map_pins": [
                app._make_crisis_map_pin(
                    {
                        "latitude": 12.5,
                        "longitude": -45.2,
                        "captured_at": "<unsafe>",
                        "capture_time_timezone_known": False,
                    },
                    {
                        "target_label": "Water_Disaster",
                        "target_category": "Flooding and water-related hazards",
                    },
                    "hash",
                )
            ]
        }
        chart = unittest.mock.Mock()
        with patch.object(app.st, "session_state", state):
            with patch.object(app.st, "pydeck_chart", chart):
                with patch.object(app.st, "subheader"):
                    with patch.object(app.st, "caption"):
                        with patch.object(app.st, "dataframe"):
                            app._render_crisis_map()

        deck = chart.call_args.args[0]
        serialized = json.loads(deck.to_json())
        layer = serialized["layers"][0]
        self.assertTrue(layer["pickable"])
        self.assertEqual(
            layer["data"][0]["tooltip_category"],
            "Flooding and water-related hazards",
        )
        self.assertEqual(layer["data"][0]["tooltip_time"], "&lt;unsafe&gt;")


if __name__ == "__main__":
    unittest.main()
