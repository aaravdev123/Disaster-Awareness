"""Inference components for the disaster risk screening service."""

from __future__ import annotations

import threading
from typing import Dict, List, Optional, Tuple

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

_HAZARD_CLASS_SEVERITY = {
    "avalanche": 1.0,
    "volcano": 1.0,
    "wreck": 0.9,
    "fire engine": 0.75,
    "fireboat": 0.75,
    "dam": 0.75,
    "breakwater": 0.65,
    "cliff": 0.60,
    "seashore": 0.45,
    "lakeside": 0.40,
    "geyser": 0.55,
    "valley": 0.25,
    "mountain": 0.20,
    "alp": 0.20,
}


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
    """Run a transparent tabular score and an optional pretrained vision model."""

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
        """Classify an image and derive a cautious proxy score from related labels."""
        self._load_vision_model()
        from PIL import Image
        from io import BytesIO

        assert self._torch is not None
        assert self._vision_model is not None
        assert self._vision_transform is not None
        assert self._vision_categories is not None
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
        tensor = self._vision_transform(image).unsqueeze(0)
        with self._torch.inference_mode():
            probabilities = self._torch.nn.functional.softmax(
                self._vision_model(tensor)[0], dim=0
            )
        top_probabilities, top_indices = self._torch.topk(probabilities, k=5)
        predictions = [
            {
                "label": self._vision_categories[int(index)],
                "probability": round(float(probability), 4),
            }
            for probability, index in zip(top_probabilities, top_indices)
        ]
        confidence = float(top_probabilities[0])

        hazard_signal = 0.0
        matched_labels = []
        for probability, index in zip(top_probabilities, top_indices):
            label = self._vision_categories[int(index)].lower()
            severity = next(
                (
                    value
                    for keyword, value in _HAZARD_CLASS_SEVERITY.items()
                    if keyword in label
                ),
                None,
            )
            if severity is not None:
                hazard_signal += float(probability) * severity
                matched_labels.append(label)

        # ImageNet probabilities are not calibrated for disasters; this is only a
        # visual cue, not a probability that a disaster is occurring.
        score = min(1.0, hazard_signal / 0.50)
        return {
            "score": round(score, 4),
            "model_confidence": round(confidence, 4),
            "out_of_domain": confidence < 0.08,
            "matched_hazard_labels": matched_labels,
            "top_predictions": predictions,
            "model_name": "EfficientNet-B0 (ImageNet pretrained; not disaster-trained)",
        }

    def _load_vision_model(self) -> None:
        """Load pretrained model weights once, surfacing installation/download errors."""
        if self._vision_model is not None:
            return

        with self._vision_lock:
            if self._vision_model is not None:
                return
            try:
                import torch
                from torchvision.models import EfficientNet_B0_Weights, efficientnet_b0
            except (ImportError, RuntimeError) as exc:
                raise RuntimeError(
                    "Vision inference requires compatible PyTorch and torchvision "
                    "installations. Install the project requirements and retry."
                ) from exc

            try:
                weights = EfficientNet_B0_Weights.DEFAULT
                model = efficientnet_b0(weights=weights)
            except (OSError, RuntimeError) as exc:
                raise RuntimeError(
                    "EfficientNet-B0 weights could not be loaded. Check network "
                    "access on the first run or the local PyTorch model cache."
                ) from exc

            self._torch = torch
            self._vision_model = model.eval()
            self._vision_transform = weights.transforms()
            self._vision_categories = weights.meta["categories"]
