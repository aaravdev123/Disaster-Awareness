"""Image validation and keyless Open-Meteo weather lookup utilities."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, time, timezone
from io import BytesIO
import math
from typing import Optional

import cv2
import httpx
import numpy as np
from PIL import ExifTags, Image, UnidentifiedImageError


MAX_IMAGE_BYTES = 25 * 1024 * 1024
MAX_IMAGE_PIXELS = 40_000_000
MIN_BLUR_VARIANCE = 40.0
SUPPORTED_IMAGE_FORMATS = {"JPEG", "PNG"}


class ImageValidationError(ValueError):
    """Raised when an uploaded image is unsafe, corrupt, or unusable."""


class WeatherLookupError(RuntimeError):
    """Raised when a location or weather provider request cannot be completed."""


class IPGeolocationError(RuntimeError):
    """Raised when an opted-in IP-based location lookup cannot be completed."""


@dataclass(frozen=True)
class ImagePreflight:
    """Summary of image checks performed before model inference."""

    width: int
    height: int
    image_format: str
    blur_variance: float


def validate_image(image_bytes: bytes) -> ImagePreflight:
    """Verify image format, decodeability, dimensions, and a basic blur threshold."""
    if not image_bytes:
        raise ImageValidationError("The uploaded image is empty.")
    if len(image_bytes) > MAX_IMAGE_BYTES:
        raise ImageValidationError("Image exceeds the 25 MB upload limit.")

    try:
        with Image.open(BytesIO(image_bytes)) as image:
            image_format = image.format or ""
            if image_format not in SUPPORTED_IMAGE_FORMATS:
                raise ImageValidationError("Only JPEG and PNG images are supported.")
            image.verify()
        with Image.open(BytesIO(image_bytes)) as image:
            width, height = image.size
            if width < 64 or height < 64:
                raise ImageValidationError("Image dimensions must be at least 64 by 64 pixels.")
            if width * height > MAX_IMAGE_PIXELS:
                raise ImageValidationError("Image dimensions exceed the 40 megapixel limit.")
            image.load()
    except ImageValidationError:
        raise
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError) as exc:
        raise ImageValidationError(
            "The image is corrupted or cannot be decoded."
        ) from exc

    encoded = np.frombuffer(image_bytes, dtype=np.uint8)
    decoded = cv2.imdecode(encoded, cv2.IMREAD_COLOR)
    if decoded is None:
        raise ImageValidationError("The image could not be decoded by the preflight checker.")
    grayscale = cv2.cvtColor(decoded, cv2.COLOR_BGR2GRAY)
    blur_variance = float(cv2.Laplacian(grayscale, cv2.CV_64F).var())
    if blur_variance < MIN_BLUR_VARIANCE:
        raise ImageValidationError(
            "The image appears too blurry for assessment. Upload a sharper image."
        )

    return ImagePreflight(
        width=width,
        height=height,
        image_format=image_format,
        blur_variance=round(blur_variance, 2),
    )


def is_previewable_image(image_bytes: bytes) -> bool:
    """Return whether a bounded upload can be decoded safely for dashboard preview."""
    if not image_bytes or len(image_bytes) > MAX_IMAGE_BYTES:
        return False
    try:
        with Image.open(BytesIO(image_bytes)) as image:
            if image.format not in SUPPORTED_IMAGE_FORMATS:
                return False
            width, height = image.size
            if (
                width < 1
                or height < 1
                or width * height > MAX_IMAGE_PIXELS
            ):
                return False
            image.verify()
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError):
        return False
    return True


def _exif_rational_to_float(component) -> float:
    """Convert a Pillow EXIF rational value to a float."""
    if isinstance(component, (tuple, list)) and len(component) == 2:
        numerator, denominator = component
        if float(denominator) == 0:
            raise ValueError("Invalid EXIF rational value.")
        return float(numerator) / float(denominator)
    return float(component)


def _exif_dms_to_decimal(value) -> float:
    """Convert an EXIF degrees/minutes/seconds tuple into decimal degrees."""
    degrees, minutes, seconds = (
        _exif_rational_to_float(component) for component in value
    )
    if not (
        0 <= degrees <= 180
        and 0 <= minutes < 60
        and 0 <= seconds < 60
    ):
        raise ValueError("Invalid EXIF coordinate components.")
    return degrees + minutes / 60 + seconds / 3600


def extract_image_metadata(image_bytes: bytes) -> dict:
    """Read capture time and GPS from EXIF without failing image review."""
    metadata = {
        "latitude": None,
        "longitude": None,
        "captured_at": None,
        "capture_time_timezone_known": False,
    }
    try:
        with Image.open(BytesIO(image_bytes)) as image:
            exif = image.getexif()
            gps_ifd = exif.get_ifd(ExifTags.IFD.GPSInfo)

            def gps_value(tag: int):
                return gps_ifd.get(tag, gps_ifd.get(ExifTags.GPSTAGS.get(tag)))

            def exif_value(tag: int):
                return exif.get(tag, exif.get(ExifTags.TAGS.get(tag)))

            latitude_ref = gps_value(1)
            longitude_ref = gps_value(3)
            latitude_value = gps_value(2)
            longitude_value = gps_value(4)

            if (
                latitude_ref in {"N", "S"}
                and longitude_ref in {"E", "W"}
                and latitude_value is not None
                and longitude_value is not None
            ):
                latitude = _exif_dms_to_decimal(latitude_value)
                longitude = _exif_dms_to_decimal(longitude_value)
                if latitude <= 90 and longitude <= 180:
                    metadata["latitude"] = -latitude if latitude_ref == "S" else latitude
                    metadata["longitude"] = (
                        -longitude if longitude_ref == "W" else longitude
                    )

            capture_time = exif_value(36867) or exif_value(36868) or exif_value(306)
            if capture_time:
                capture_time = (
                    capture_time.decode("ascii", errors="ignore")
                    if isinstance(capture_time, bytes)
                    else str(capture_time)
                ).strip()
                parsed_time = datetime.strptime(
                    capture_time, "%Y:%m:%d %H:%M:%S"
                )
                offset = exif_value(36881)
                if offset:
                    offset = (
                        offset.decode("ascii", errors="ignore")
                        if isinstance(offset, bytes)
                        else str(offset)
                    ).strip()
                    parsed_time = datetime.strptime(
                        capture_time + offset, "%Y:%m:%d %H:%M:%S%z"
                    )
                    metadata["capture_time_timezone_known"] = True
                metadata["captured_at"] = parsed_time.isoformat()
            else:
                gps_date = gps_value(29)
                gps_time = gps_value(7)
                if gps_date and gps_time is not None:
                    gps_date = (
                        gps_date.decode("ascii", errors="ignore")
                        if isinstance(gps_date, bytes)
                        else str(gps_date)
                    ).strip()
                    capture_date = datetime.strptime(
                        gps_date, "%Y:%m:%d"
                    ).date()
                    hour, minute, second = (
                        _exif_rational_to_float(component)
                        for component in gps_time
                    )
                    parsed_time = datetime.combine(
                        capture_date,
                        time(int(hour), int(minute), int(second)),
                        tzinfo=timezone.utc,
                    )
                    metadata["captured_at"] = parsed_time.isoformat()
                    metadata["capture_time_timezone_known"] = True
    except (
        AttributeError,
        KeyError,
        OSError,
        TypeError,
        ValueError,
        ZeroDivisionError,
    ):
        return metadata
    return metadata


def fetch_ip_coordinates() -> dict:
    """Return approximate public-IP coordinates after the user opts in."""
    providers = (
        ("ipapi.co", "https://ipapi.co/json/"),
        ("ipwho.is", "https://ipwho.is/"),
    )
    failures = []
    for provider, url in providers:
        try:
            response = httpx.get(url, timeout=5.0, follow_redirects=True)
            response.raise_for_status()
            payload = response.json()
            if not isinstance(payload, dict):
                raise ValueError("invalid provider response")
            if provider == "ipwho.is" and payload.get("success") is not True:
                raise ValueError("provider reported no result")
            latitude = float(payload["latitude"])
            longitude = float(payload["longitude"])
            if not (-90 <= latitude <= 90 and -180 <= longitude <= 180):
                raise ValueError("coordinates outside valid bounds")
            return {"latitude": latitude, "longitude": longitude}
        except (httpx.HTTPError, KeyError, TypeError, ValueError) as exc:
            reason = (
                f"HTTP {exc.response.status_code}"
                if isinstance(exc, httpx.HTTPStatusError)
                else type(exc).__name__
            )
            failures.append(f"{provider}: {reason}")

    failure_details = "; ".join(failures)
    raise IPGeolocationError(
        "Could not determine an approximate location from the network IP "
        f"({failure_details}). Try entering coordinates manually or continue "
        "without a map pin."
    )


async def fetch_weather(
    location: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
) -> dict:
    """Resolve a city or coordinate pair and return recent/current Open-Meteo data."""
    if (latitude is None) != (longitude is None):
        raise WeatherLookupError("Provide both latitude and longitude.")
    if latitude is None and not location:
        raise WeatherLookupError("Provide a city name or a latitude/longitude pair.")
    if latitude is not None and not -90.0 <= latitude <= 90.0:
        raise WeatherLookupError("Latitude must be between -90 and 90 degrees.")
    if longitude is not None and not -180.0 <= longitude <= 180.0:
        raise WeatherLookupError("Longitude must be between -180 and 180 degrees.")

    async with httpx.AsyncClient(timeout=12.0) as client:
        if latitude is None:
            try:
                geocode = await client.get(
                    "https://geocoding-api.open-meteo.com/v1/search",
                    params={"name": location, "count": 1, "language": "en", "format": "json"},
                )
                geocode.raise_for_status()
            except httpx.HTTPError as exc:
                raise WeatherLookupError(
                    "The weather geocoding service is unavailable."
                ) from exc
            try:
                geocode_data = geocode.json()
            except ValueError as exc:
                raise WeatherLookupError(
                    "The weather geocoding service returned invalid data."
                ) from exc
            if not isinstance(geocode_data, dict):
                raise WeatherLookupError(
                    "The weather geocoding service returned an invalid response."
                )
            results = geocode_data.get("results") or []
            if not isinstance(results, list) or not results:
                raise WeatherLookupError("No matching location was found.")
            place = results[0]
            try:
                latitude = float(place["latitude"])
                longitude = float(place["longitude"])
            except (KeyError, TypeError, ValueError) as exc:
                raise WeatherLookupError(
                    "The weather geocoding service returned invalid coordinates."
                ) from exc
            if not -90.0 <= latitude <= 90.0 or not -180.0 <= longitude <= 180.0:
                raise WeatherLookupError(
                    "The weather geocoding service returned out-of-range coordinates."
                )
            location_name = ", ".join(
                part
                for part in (place.get("name"), place.get("admin1"), place.get("country"))
                if part
            )
        else:
            location_name = location or "GPS coordinates"

        try:
            response = await client.get(
                "https://api.open-meteo.com/v1/forecast",
                params={
                    "latitude": latitude,
                    "longitude": longitude,
                    "current": "temperature_2m,wind_speed_10m,relative_humidity_2m",
                    "hourly": "precipitation",
                    "past_days": 2,
                    "forecast_days": 1,
                    "timezone": "auto",
                    "wind_speed_unit": "kmh",
                },
            )
            response.raise_for_status()
        except httpx.HTTPError as exc:
            raise WeatherLookupError("The weather data service is unavailable.") from exc

    try:
        payload = response.json()
    except ValueError as exc:
        raise WeatherLookupError("The weather service returned invalid data.") from exc
    if not isinstance(payload, dict):
        raise WeatherLookupError("The weather service returned an invalid response.")
    current = payload.get("current")
    hourly = payload.get("hourly")
    if not isinstance(current, dict) or not isinstance(hourly, dict):
        raise WeatherLookupError("The weather provider returned incomplete data.")
    times = hourly.get("time") or []
    precipitation = hourly.get("precipitation") or []
    current_time = current.get("time")
    if (
        not isinstance(current_time, str)
        or not isinstance(times, list)
        or not isinstance(precipitation, list)
        or not times
        or len(times) != len(precipitation)
        or any(not isinstance(timestamp, str) for timestamp in times)
    ):
        raise WeatherLookupError("The weather provider returned incomplete data.")

    current_index = max(
        (index for index, timestamp in enumerate(times) if timestamp <= current_time),
        default=-1,
    )
    if current_index < 0:
        raise WeatherLookupError("The weather provider returned no recent rainfall data.")
    last_24_hours = precipitation[max(0, current_index - 23) : current_index + 1]

    try:
        baseline = {
            "location_name": location_name,
            "latitude": float(latitude),
            "longitude": float(longitude),
            "rain_24h_mm": round(sum(float(value or 0) for value in last_24_hours), 2),
            "wind_speed_kmh": float(current["wind_speed_10m"]),
            "air_temperature_c": float(current["temperature_2m"]),
            "relative_humidity_pct": float(current["relative_humidity_2m"]),
            "observed_at": datetime.fromisoformat(current_time).isoformat(),
            "source": "Open-Meteo",
        }
    except (KeyError, TypeError, ValueError) as exc:
        raise WeatherLookupError("The weather provider returned invalid measurements.") from exc
    numeric_values = (
        baseline["latitude"],
        baseline["longitude"],
        baseline["rain_24h_mm"],
        baseline["wind_speed_kmh"],
        baseline["air_temperature_c"],
        baseline["relative_humidity_pct"],
    )
    if not all(math.isfinite(value) for value in numeric_values):
        raise WeatherLookupError("The weather provider returned non-finite measurements.")
    return baseline
