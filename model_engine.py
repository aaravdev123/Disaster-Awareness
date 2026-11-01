"""Inference components for the disaster risk screening service."""

from __future__ import annotations

import base64
import pickle
import threading
from io import BytesIO
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import cv2
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import FunctionTransformer


TABULAR_WEIGHTS = {
    "rain_24h_mm": 0.30,
    "slope_angle_deg": 0.25,
    "soil_moisture_pct": 0.20,
    "wind_speed_kmh": 0.15,
    "ground_temp_c": 0.10,
}

_DISASTER_CLASSES = ("Earthquake", "Fire", "Flood")
_NON_DAMAGE_CLASS = "Non-Damage"
_MIN_CLASS_CONFIDENCE = 0.90
_VISION_CLASS_NAMES = ["Non-Damage", "Earthquake", "Fire", "Flood"]
_VISION_WEIGHTS_PATH = (
    Path(__file__).resolve().parent
    / "assets"
    / "models"
    / "disaster_resnet50_fp16.pth"
)


class ImageDomainError(ValueError):
    """Raised when the disaster classifier cannot identify a strong disaster cue."""

    def __init__(self, predictions: List[dict]) -> None:
        self.predictions = predictions
        labels = ", ".join(
            f"{item['label']} ({item['probability']:.0%})" for item in predictions
        )
        predicted_label = predictions[0]["label"] if predictions else "unknown"
        if predicted_label == _NON_DAMAGE_CLASS:
            message = (
                "The disaster-image classifier found no damage-related class "
                f"(top class: {predicted_label}). Its predictions were: {labels}. "
                "The photo may be an unrelated or non-damage scene. Upload a clear "
                "image showing fire, flood, earthquake damage, or continue with "
                "environmental measurements only."
            )
        else:
            message = (
                "The disaster-image classifier could not identify a disaster "
                f"scene with at least {_MIN_CLASS_CONFIDENCE:.0%} class confidence. "
                f"Its predictions were: {labels}. Try a clearer "
                "photo of fire, flooding, or earthquake damage, or continue with "
                "environmental measurements only."
            )
        super().__init__(message)


def _normalize_hazards(features: np.ndarray) -> np.ndarray:
    """Convert physical measurements to bounded, explainable hazard signals."""
    rain, slope, moisture, wind, temperature = features.T
    temperature_risk = np.maximum(
        np.clip((temperature - 35.0) / 25.0, 0.0, 1.0),
        np.clip(-temperature / 20.0, 0.0, 1.0),
    )
    return np.column_stack(
        (
            np.clip(rain / 200.0, 0.0, 1.0),
            np.clip(slope / 45.0, 0.0, 1.0),
            np.clip(moisture / 100.0, 0.0, 1.0),
            np.clip(wind / 120.0, 0.0, 1.0),
            temperature_risk,
        )
    )


def _aggregate_hazards(features: np.ndarray) -> np.ndarray:
    """Combine normalized measurements into one screening score per row."""
    weights = np.asarray(list(TABULAR_WEIGHTS.values()), dtype=np.float64)
    return np.clip(features @ weights, 0.0, 1.0).reshape(-1, 1)


class MultimodalRiskEngine:
    """Run a transparent tabular score and a disaster-fine-tuned vision model."""

    def __init__(self) -> None:
        self._tabular_pipeline = Pipeline(
            steps=[
                (
                    "normalize_hazards",
                    FunctionTransformer(_normalize_hazards, validate=False),
                ),
                (
                    "weighted_hazard_score",
                    FunctionTransformer(_aggregate_hazards, validate=False),
                ),
            ]
        )
        self._tabular_pipeline.fit(np.zeros((1, len(TABULAR_WEIGHTS))))
        self._vision_lock = threading.Lock()
        self._inference_lock = threading.Lock()
        self._vision_model = None
        self._vision_transform = None
        self._vision_categories: Optional[List[str]] = None
        self._torch = None

    def score_environment(
        self, metrics: Dict[str, float]
    ) -> Tuple[float, Dict[str, float]]:
        """Return the deterministic environmental score and its component signals."""
        feature_row = np.asarray(
            [
                [
                    metrics["rain_24h_mm"],
                    metrics["slope_angle_deg"],
                    metrics["soil_moisture_pct"],
                    metrics["wind_speed_kmh"],
                    metrics["ground_temp_c"],
                ]
            ],
            dtype=np.float64,
        )
        normalized = _normalize_hazards(feature_row)[0]
        score = float(self._tabular_pipeline.transform(feature_row)[0, 0])
        components = {
            name: round(float(value), 4)
            for name, value in zip(TABULAR_WEIGHTS, normalized)
        }
        return score, components

    def score_image(self, image_bytes: bytes) -> Dict[str, object]:
        """Classify an image and return a Grad-CAM visual explanation."""
        self._load_vision_model()
        from PIL import Image

        assert self._torch is not None
        assert self._vision_model is not None
        assert self._vision_transform is not None
        assert self._vision_categories is not None
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
        tensor = self._vision_transform(image).unsqueeze(0).to(self._vision_device)
        activation_cache = []
        target_layer = self._vision_model.layer4[-1]
        with self._inference_lock:
            hook = target_layer.register_forward_hook(
                lambda _module, _inputs, output: activation_cache.append(output)
            )
            try:
                self._vision_model.zero_grad(set_to_none=True)
                logits = self._vision_model(tensor)[0]
                probabilities = self._torch.nn.functional.softmax(
                    logits.detach(), dim=0
                )
                top_probabilities, top_indices = self._torch.topk(
                    probabilities, k=len(self._vision_categories)
                )
                interpretation = self._interpret_predictions(
                    top_probabilities, top_indices
                )
                if interpretation["out_of_domain"]:
                    raise ImageDomainError(interpretation["top_predictions"])

                target_index = interpretation.pop("target_index")
                target_activation = activation_cache[0]
                gradients = self._torch.autograd.grad(
                    logits[target_index], target_activation, retain_graph=False
                )[0]
                channel_weights = gradients.mean(dim=(2, 3), keepdim=True)
                cam = self._torch.relu(
                    (channel_weights * target_activation).sum(dim=1, keepdim=True)
                )[0, 0]
                cam = self._torch.nn.functional.interpolate(
                    cam[None, None],
                    size=(image.height, image.width),
                    mode="bilinear",
                    align_corners=False,
                )[0, 0]
                cam = cam.detach().cpu().numpy()
            finally:
                hook.remove()

        cam_max = float(cam.max())
        if cam_max > 1e-8:
            cam = cam / cam_max
        else:
            cam = np.zeros_like(cam, dtype=np.float32)

        regions = self._extract_saliency_regions(cam)
        overlay = self._render_explanation(image, cam, regions)
        return {
            **interpretation,
            "saliency_regions": regions,
            "explanation_image_base64": base64.b64encode(overlay).decode("ascii"),
            "analysis_target": (
                "Grad-CAM for the disaster classifier class "
                f"'{interpretation['target_label']}'"
            ),
            "explanation_note": (
                "Rectangles show image regions that influenced this classifier's "
                "label. They are not object detections, hazard boundaries, or proof "
                "that damage or a disaster is present. The classifier was fine-tuned "
                "on aerial imagery and may not generalize to ground-level photos."
            ),
        }

    def _interpret_predictions(self, top_probabilities, top_indices) -> dict:
        """Return the disaster-class probability mass and reject weak predictions."""
        predictions = [
            {
                "label": self._vision_categories[int(index)],
                "probability": round(float(probability), 4),
            }
            for probability, index in zip(top_probabilities, top_indices)
        ]
        confidence = float(top_probabilities[0])
        class_probabilities = {
            self._vision_categories[int(index)]: float(probability)
            for probability, index in zip(top_probabilities, top_indices)
        }
        hazard_signal = sum(
            class_probabilities.get(label, 0.0)
            for label in _DISASTER_CLASSES
        )
        matched_predictions = []
        for probability, index in zip(top_probabilities, top_indices):
            label = self._vision_categories[int(index)]
            if label in _DISASTER_CLASSES:
                probability_value = float(probability)
                matched_predictions.append(
                    {
                        "label": label,
                        "probability": round(probability_value, 4),
                    }
                )

        target_label = predictions[0]["label"]
        out_of_domain = (
            target_label == _NON_DAMAGE_CLASS
            or confidence < _MIN_CLASS_CONFIDENCE
        )
        return {
            "score": round(float(np.clip(hazard_signal, 0.0, 1.0)), 4),
            "model_confidence": round(confidence, 4),
            "out_of_domain": out_of_domain,
            "target_label": target_label,
            "target_index": int(top_indices[0]),
            "matched_hazard_labels": [
                label for label in _DISASTER_CLASSES if class_probabilities[label] > 0
            ],
            "matched_hazard_predictions": matched_predictions,
            "top_predictions": predictions,
            "model_name": (
                "ResNet50 fine-tuned on a four-class natural-disaster image dataset"
            ),
        }

    @staticmethod
    def _extract_saliency_regions(cam: np.ndarray) -> List[dict]:
        """Find prominent connected attention areas in a normalized Grad-CAM map."""
        if not np.isfinite(cam).all() or float(cam.max()) <= 1e-8:
            return []

        threshold = max(0.45, float(np.percentile(cam[cam > 0], 80)))
        mask = (cam >= threshold).astype(np.uint8)
        kernel = np.ones((3, 3), dtype=np.uint8)
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
        component_count, labels, stats, _ = cv2.connectedComponentsWithStats(
            mask, connectivity=8
        )

        image_height, image_width = cam.shape
        min_area = max(16, int(image_width * image_height * 0.002))
        regions = []
        for component_id in range(1, component_count):
            x, y, width, height, area = (
                int(value) for value in stats[component_id]
            )
            if area < min_area:
                continue
            region_values = cam[labels == component_id]
            regions.append(
                {
                    "x": x,
                    "y": y,
                    "width": width,
                    "height": height,
                    "activation_pct": round(
                        float(region_values.mean()) * 100, 1
                    ),
                    "area_pct": round(area / (image_width * image_height) * 100, 1),
                }
            )
        regions.sort(key=lambda region: region["activation_pct"], reverse=True)
        return regions[:3]

    @staticmethod
    def _render_explanation(image, cam: np.ndarray, regions: List[dict]) -> bytes:
        """Create a compact heatmap overlay annotated with attention rectangles."""
        original_rgb = np.asarray(image.convert("RGB"))
        original_bgr = cv2.cvtColor(original_rgb, cv2.COLOR_RGB2BGR)

        max_dimension = 1200
        scale = min(1.0, max_dimension / max(image.width, image.height))
        output_width = max(1, round(image.width * scale))
        output_height = max(1, round(image.height * scale))
        if scale < 1:
            original_bgr = cv2.resize(
                original_bgr,
                (output_width, output_height),
                interpolation=cv2.INTER_AREA,
            )
        small_cam = cv2.resize(
            cam, (output_width, output_height), interpolation=cv2.INTER_LINEAR
        )
        heatmap = cv2.applyColorMap(
            np.uint8(np.clip(small_cam, 0, 1) * 255), cv2.COLORMAP_TURBO
        )
        overlay = cv2.addWeighted(original_bgr, 0.58, heatmap, 0.42, 0)

        for number, region in enumerate(regions, start=1):
            x1 = round(region["x"] * scale)
            y1 = round(region["y"] * scale)
            x2 = round((region["x"] + region["width"]) * scale)
            y2 = round((region["y"] + region["height"]) * scale)
            cv2.rectangle(overlay, (x1, y1), (x2, y2), (40, 255, 170), 2)
            cv2.putText(
                overlay,
                f"Region {number}",
                (x1, max(20, y1 - 8)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (40, 255, 170),
                2,
                cv2.LINE_AA,
            )

        success, encoded = cv2.imencode(
            ".jpg", overlay, [cv2.IMWRITE_JPEG_QUALITY, 78]
        )
        if not success:
            raise RuntimeError("Could not encode the image explanation overlay.")
        return encoded.tobytes()

    def _load_vision_model(self) -> None:
        """Load the bundled, locally stored disaster checkpoint exactly once."""
        if self._vision_model is not None:
            return

        with self._vision_lock:
            if self._vision_model is not None:
                return
            if not _VISION_WEIGHTS_PATH.is_file():
                raise RuntimeError(
                    "The local disaster model weights are missing. Ensure "
                    "assets/models/disaster_resnet50_fp16.pth is present in the "
                    "project checkout."
                )
            try:
                import torch
                from torchvision import models, transforms
            except (ImportError, RuntimeError) as exc:
                raise RuntimeError(
                    "Vision inference requires compatible PyTorch and torchvision "
                    "installations. Install the project requirements and retry."
                ) from exc

            try:
                state_dict = torch.load(
                    _VISION_WEIGHTS_PATH,
                    map_location="cpu",
                    weights_only=True,
                )
                if not isinstance(state_dict, dict):
                    raise TypeError("The checkpoint is not a state dictionary.")
                model = models.resnet50(weights=None)
                model.fc = torch.nn.Linear(
                    model.fc.in_features, len(_VISION_CLASS_NAMES)
                )
                model.load_state_dict(state_dict, strict=True)
            except (OSError, RuntimeError, KeyError, TypeError, pickle.UnpicklingError) as exc:
                raise RuntimeError(
                    "The disaster-specific ResNet50 checkpoint is invalid or "
                    "incompatible with this PyTorch installation. Verify the "
                    "bundled model file and install the listed requirements."
                ) from exc

            if torch.cuda.is_available():
                device = torch.device("cuda")
            elif getattr(torch.backends, "mps", None) and torch.backends.mps.is_available():
                device = torch.device("mps")
            else:
                device = torch.device("cpu")
            self._torch = torch
            self._vision_model = model.eval().to(device)
            self._vision_device = device
            self._vision_transform = transforms.Compose(
                [
                    transforms.Resize((224, 224)),
                    transforms.ToTensor(),
                    transforms.Normalize(
                        mean=[0.485, 0.456, 0.406],
                        std=[0.229, 0.224, 0.225],
                    ),
                ]
            )
            self._vision_categories = _VISION_CLASS_NAMES
