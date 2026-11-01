import unittest
from types import SimpleNamespace
from unittest.mock import Mock, patch

import app
from model_engine import hazard_category_for_label
from streamlit.testing.v1 import AppTest


class StubRiskEngine:
    def score_environment(self, _metrics):
        return 0.4, {"rain_24h_mm": 0.5}

    def score_image(self, _image_bytes):
        return {
            "score": 0.25,
            "image_only_estimate_pct": 25.0,
            "score_basis": "Test classifier score.",
            "model_confidence": self.confidence,
            "confidence_threshold": 0.9,
            "out_of_domain": self.out_of_domain,
            "target_label": self.target_label,
            "top_predictions": [
                {"label": self.target_label, "probability": self.confidence}
            ],
        }


class AssessmentFallbackTests(unittest.TestCase):
    def test_dashboard_is_image_only(self):
        result = AppTest.from_file("app.py").run()

        self.assertFalse(result.exception, result.exception)
        self.assertFalse(result.error, result.error)
        self.assertEqual(
            [item.value for item in result.title],
            ["Disaster Image Analyzer"],
        )
        markdown = "\n".join(item.value for item in result.markdown)
        self.assertIn("disasterready-topbar", markdown)
        self.assertIn("disasterready-upload-heading", markdown)
        self.assertEqual(
            [button.label for button in result.button if not button.disabled],
            [],
        )
        self.assertEqual(len(result.get("slider")), 0)
        self.assertNotIn(
            "Environmental measurements",
            [item.value for item in result.subheader],
        )

    def build_report(self, engine):
        metrics = app.RiskMetrics(
            rain_24h_mm=0,
            slope_angle_deg=0,
            soil_moisture_pct=0,
            wind_speed_kmh=0,
            ground_temp_c=20,
        )
        with patch.object(app, "_engine", engine):
            return app._build_assessment_report(
                metrics=metrics,
                weather_data=None,
                location=None,
                latitude=None,
                longitude=None,
                image_bytes=b"test image",
                preflight=None,
            )

    def test_low_confidence_image_keeps_tabular_assessment(self):
        engine = StubRiskEngine()
        engine.confidence = 0.72
        engine.out_of_domain = True
        engine.target_label = "Earthquake"

        report = self.build_report(engine)

        self.assertEqual(report["fusion"]["risk_index_pct"], 40.0)
        self.assertEqual(report["fusion"]["weights"], {"vision": 0.0, "tabular": 1.0})
        self.assertFalse(report["vision"]["included_in_fusion"])
        self.assertIn("72%", report["vision"]["exclusion_reason"])
        self.assertEqual(report["vision"]["top_predictions"][0]["label"], "Earthquake")
        self.assertEqual(
            report["image_only_disaster_estimate"]["score_pct"], 25.0
        )
        self.assertFalse(
            report["image_only_disaster_estimate"]["calibrated_probability"]
        )

    def test_non_damage_image_keeps_tabular_assessment(self):
        engine = StubRiskEngine()
        engine.confidence = 0.96
        engine.out_of_domain = True
        engine.target_label = "Non_Damage"

        report = self.build_report(engine)

        self.assertEqual(report["fusion"]["risk_index_pct"], 40.0)
        self.assertFalse(report["fusion"]["vision_included"])
        self.assertIn("Non_Damage", report["vision"]["exclusion_reason"])

    def test_confident_disaster_image_uses_weighted_fusion(self):
        engine = StubRiskEngine()
        engine.confidence = 0.95
        engine.out_of_domain = False
        engine.target_label = "Water_Disaster"

        report = self.build_report(engine)

        self.assertEqual(report["fusion"]["risk_index_pct"], 34.0)
        self.assertEqual(report["fusion"]["weights"], {"vision": 0.4, "tabular": 0.6})
        self.assertTrue(report["vision"]["included_in_fusion"])

    def test_model_labels_map_to_broad_user_facing_categories(self):
        self.assertEqual(
            hazard_category_for_label("Water_Disaster"),
            "Flooding and water-related hazards",
        )
        self.assertEqual(
            hazard_category_for_label("Fire_Disaster"),
            "Fire-related hazards",
        )
        self.assertEqual(
            hazard_category_for_label("Non_Damage"),
            "No visible disaster damage",
        )
        self.assertEqual(
            hazard_category_for_label("Unseen_Disaster_Class"),
            "Unseen disaster class",
        )

    def test_image_only_review_does_not_score_environment(self):
        engine = StubRiskEngine()
        engine.score_image = Mock(return_value={"target_label": "Water_Disaster"})
        engine.score_environment = Mock(side_effect=AssertionError("must not run"))
        preflight = SimpleNamespace(
            width=128,
            height=128,
            image_format="PNG",
            blur_variance=45.0,
        )

        with patch.object(app, "_engine", engine):
            with patch.object(app, "validate_image", return_value=preflight):
                review = app._build_image_only_review(b"image-bytes")

        self.assertEqual(review["vision"]["target_label"], "Water_Disaster")
        self.assertEqual(review["preflight"]["format"], "PNG")
        engine.score_environment.assert_not_called()
        engine.score_image.assert_called_once_with(b"image-bytes")


if __name__ == "__main__":
    unittest.main()
