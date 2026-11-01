"""Local Streamlit dashboard and optional FastAPI disaster-risk API.

Run the dashboard with ``streamlit run app.py``. It performs inference in-process;
run ``uvicorn app:api`` separately only when you need the HTTP API.
"""

from __future__ import annotations

import asyncio
import base64
import hashlib
from html import escape
import json
from datetime import datetime, timezone
from typing import Dict, Optional
from uuid import uuid4

import pydeck as pdk
import streamlit as st
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel, ConfigDict, Field, ValidationError
from starlette.responses import JSONResponse

from model_engine import MultimodalRiskEngine
from utils import (
    MAX_IMAGE_BYTES,
    IPGeolocationError,
    ImageValidationError,
    WeatherLookupError,
    extract_image_metadata,
    fetch_ip_coordinates,
    fetch_weather,
    is_previewable_image,
    validate_image,
)


api = FastAPI(
    title="Disaster Risk Assessment API",
    description=(
        "Educational screening based on user measurements, optional imagery, "
        "and Open-Meteo weather baselines. It is not an emergency warning service."
    ),
    version="1.0.0",
)
_engine = MultimodalRiskEngine()
_MAX_REQUEST_BYTES = MAX_IMAGE_BYTES + 1024 * 1024
_MAX_SESSION_MAP_PINS = 100
_MAP_COLORS = {
    "Damaged_Infrastructure": [255, 159, 67, 210],
    "Fire_Disaster": [239, 68, 68, 220],
    "Human_Damage": [214, 64, 140, 220],
    "Land_Disaster": [180, 130, 70, 220],
    "Non_Damage": [120, 130, 145, 180],
    "Water_Disaster": [52, 152, 219, 220],
}


@api.middleware("http")
async def limit_request_size(request, call_next):
    """Reject oversized requests before multipart processing starts."""
    content_length = request.headers.get("content-length")
    if content_length is not None:
        try:
            request_size = int(content_length)
        except ValueError:
            return JSONResponse(
                status_code=400, content={"detail": "Invalid Content-Length header."}
            )
        if request_size < 0 or request_size > _MAX_REQUEST_BYTES:
            return JSONResponse(
                status_code=413,
                content={"detail": "Request exceeds the 26 MB upload limit."},
            )
    return await call_next(request)


_RISK_LEVELS = (
    (25, "Low"),
    (50, "Moderate"),
    (75, "High"),
    (101, "Extreme"),
)


class RiskMetrics(BaseModel):
    """Validated physical measurements used by the tabular risk scorer."""

    model_config = ConfigDict(extra="forbid", allow_inf_nan=False)

    rain_24h_mm: float = Field(ge=0, le=1000)
    slope_angle_deg: float = Field(ge=0, le=90)
    soil_moisture_pct: float = Field(ge=0, le=100)
    wind_speed_kmh: float = Field(ge=0, le=400)
    ground_temp_c: float = Field(ge=-60, le=70)


def _risk_level(score: float) -> str:
    """Map a 0–100 index to the dashboard's four alert bands."""
    for upper_bound, label in _RISK_LEVELS:
        if score < upper_bound:
            return label
    return "Extreme"


def _validate_coordinates(
    latitude: Optional[float], longitude: Optional[float]
) -> None:
    """Reject incomplete or out-of-range coordinates as client input errors."""
    if (latitude is None) != (longitude is None):
        raise HTTPException(
            status_code=422, detail="Provide both latitude and longitude."
        )
    if latitude is not None and not -90.0 <= latitude <= 90.0:
        raise HTTPException(
            status_code=422, detail="Latitude must be between -90 and 90 degrees."
        )
    if longitude is not None and not -180.0 <= longitude <= 180.0:
        raise HTTPException(
            status_code=422, detail="Longitude must be between -180 and 180 degrees."
        )


def _safety_checklist(level: str) -> list:
    """Build practical screening guidance without replacing local authorities."""
    checklist = [
        "Check current advisories from your local disaster-management and weather authorities.",
        "Confirm household contacts, a safe meeting point, and the nearest shelter.",
        "Keep drinking water, essential medicines, a flashlight, and charged devices ready.",
    ]
    if level in {"Moderate", "High", "Extreme"}:
        checklist.extend(
            [
                "Avoid riverbanks, unstable slopes, flooded roads, and exposed outdoor areas.",
                "Review evacuation routes and move essential documents and supplies to safety.",
            ]
        )
    if level in {"High", "Extreme"}:
        checklist.append(
            "If authorities advise evacuation, leave promptly; do not wait for this assessment."
        )
    if level == "Extreme":
        checklist.append(
            "Contact local emergency services if anyone is in immediate danger."
        )
    return checklist


def _dashboard_input_signature(
    metrics: Dict[str, float],
    image_bytes: Optional[bytes],
    location: Optional[str],
    latitude: Optional[float],
    longitude: Optional[float],
    use_live_weather: bool,
) -> str:
    """Identify the exact dashboard inputs behind a displayed assessment."""
    payload = {
        "metrics": metrics,
        "image_sha256": (
            hashlib.sha256(image_bytes).hexdigest() if image_bytes is not None else None
        ),
        "location": location,
        "latitude": latitude,
        "longitude": longitude,
        "use_live_weather": use_live_weather,
    }
    return hashlib.sha256(
        json.dumps(payload, sort_keys=True, allow_nan=False).encode("utf-8")
    ).hexdigest()


def _build_assessment_report(
    metrics: RiskMetrics,
    weather_data: Optional[dict],
    location: Optional[str],
    latitude: Optional[float],
    longitude: Optional[float],
    image_bytes: Optional[bytes],
    preflight,
) -> dict:
    """Run local model inference and build the shared API/dashboard report."""
    metric_dict = metrics.model_dump()
    tabular_score, tabular_components = _engine.score_environment(metric_dict)
    vision = _engine.score_image(image_bytes) if image_bytes is not None else None
    vision_included = vision is not None and not vision["out_of_domain"]
    if vision is not None:
        vision["included_in_fusion"] = vision_included
        if not vision_included:
            target_label = vision["target_label"]
            target_confidence = vision["model_confidence"]
            if target_label == "Non_Damage":
                vision["exclusion_reason"] = (
                    "The model classified this image as Non_Damage. Its image score "
                    "was not used in the risk index."
                )
            else:
                vision["exclusion_reason"] = (
                    f"The top class confidence ({target_confidence:.0%}) is below "
                    f"the {vision['confidence_threshold']:.0%} inclusion threshold. "
                    "Its image score was not used "
                    "in the risk index."
                )

    if not vision_included:
        risk_score = tabular_score * 100
        fusion_weights = {"vision": 0.0, "tabular": 1.0}
    else:
        risk_score = (0.40 * float(vision["score"]) + 0.60 * tabular_score) * 100
        fusion_weights = {"vision": 0.40, "tabular": 0.60}
    risk_score = round(risk_score, 1)
    level = _risk_level(risk_score)

    return {
        "assessment_id": uuid4().hex[:16],
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "site": {
            "location_name": weather_data["location_name"] if weather_data else location,
            "latitude": weather_data["latitude"] if weather_data else latitude,
            "longitude": weather_data["longitude"] if weather_data else longitude,
        },
        "metrics": metric_dict,
        "weather_baseline": weather_data,
        "image_preflight": (
            {
                "width": preflight.width,
                "height": preflight.height,
                "format": preflight.image_format,
                "blur_variance": preflight.blur_variance,
            }
            if preflight
            else None
        ),
        "image_metadata": extract_image_metadata(image_bytes)
        if image_bytes is not None
        else None,
        "vision": vision,
        "image_only_disaster_estimate": (
            {
                "score_pct": vision["image_only_estimate_pct"],
                "basis": vision["score_basis"],
                "calibrated_probability": False,
            }
            if vision is not None
            else None
        ),
        "tabular": {
            "score": round(tabular_score, 4),
            "component_signals": tabular_components,
            "method": "Weighted thresholds; not a trained or calibrated model",
        },
        "fusion": {
            "weights": fusion_weights,
            "vision_included": vision_included,
            "risk_index_pct": risk_score,
            "alert_level": level,
        },
        "safety_checklist": _safety_checklist(level),
        "limitations": [
            "This educational screening tool is not an official forecast, warning, or evacuation instruction.",
            "The community vision model's model card does not identify its training dataset or provide numeric evaluation results.",
            "The vision score is the classifier probability mass across five disaster-related classes; it is not calibrated for disaster severity and may misclassify unrelated images.",
            "Images below the 90% class-confidence threshold or classified as Non_Damage are shown for diagnostic purposes but excluded from the risk-index fusion.",
            "The tabular score uses transparent heuristic thresholds and is not empirically calibrated.",
            "Weather readings are provider baselines and may differ from conditions at the site.",
            "Follow local emergency services and official weather authorities.",
        ],
    }


def _render_image_review(
    vision: dict,
    image_bytes: bytes,
    image_metadata: Optional[dict] = None,
    included_in_fusion: Optional[bool] = None,
) -> None:
    """Render classifier results without presenting them as verified detections."""
    estimate_pct = vision.get(
        "image_only_estimate_pct", round(float(vision["score"]) * 100, 1)
    )
    st.subheader("Image-only disaster estimate")
    st.metric("Model-estimated disaster signal", f"{estimate_pct:.1f}%")
    st.progress(estimate_pct / 100.0)
    st.caption(
        "Calculated from the image alone as the model's combined score across "
        "its disaster-related categories. This is a classifier score, not a "
        "calibrated probability that a disaster is occurring."
    )
    original_column, analysis_column = st.columns(2)
    with original_column:
        st.image(
            image_bytes,
            caption="Original uploaded image",
            use_container_width=True,
        )
    with analysis_column:
        overlay_bytes = base64.b64decode(
            vision["explanation_image_base64"], validate=True
        )
        st.image(
            overlay_bytes,
            caption="Grad-CAM attention heatmap and analyzed-region boxes",
            use_container_width=True,
        )
    st.markdown(
        f"**Broad image category / Grad-CAM target:** "
        f"{vision['target_category']}"
    )
    st.caption(
        f"Model class: `{vision['target_label']}`. Categories are broad "
        "image classifications and do not confirm a specific event."
    )
    if image_metadata and image_metadata["latitude"] is not None:
        captured = image_metadata["captured_at"] or "Capture time not present in EXIF"
        st.info(
            f"Photo EXIF location: {image_metadata['latitude']:.5f}, "
            f"{image_metadata['longitude']:.5f}. Capture time: {captured}."
        )
    elif image_metadata is not None:
        st.info(
            "This image has no usable GPS coordinates in its EXIF metadata, "
            "so it cannot be pinned automatically."
        )
    target_prediction = next(
        (
            prediction
            for prediction in vision["top_predictions"]
            if prediction["label"] == vision["target_label"]
        ),
        None,
    )
    if target_prediction:
        st.caption(
            "Category confidence: "
            f"{target_prediction['probability']:.1%}. This is class "
            "confidence, not a probability that a disaster is occurring. "
            + (
                "This image score was included in the 40% vision / 60% "
                "environmental fusion."
                if included_in_fusion
                else (
                    "This image score was excluded from the risk-index fusion."
                    if included_in_fusion is False
                    else "This is an image-only review; no environmental risk "
                    "assessment was run."
                )
            )
        )
    st.caption(vision["explanation_note"])
    st.markdown("**Regions that most influenced the label**")
    if vision["saliency_regions"]:
        region_rows = [
            {
                "Region": f"Region {index}",
                "Image bounds (pixels)": (
                    f"x={region['x']}, y={region['y']}, "
                    f"w={region['width']}, h={region['height']}"
                ),
                "Mean attention": f"{region['activation_pct']:.1f}%",
                "Image area": f"{region['area_pct']:.1f}%",
            }
            for index, region in enumerate(vision["saliency_regions"], start=1)
        ]
        st.dataframe(region_rows, hide_index=True, use_container_width=True)
    else:
        st.info("The model did not isolate a distinct high-attention region.")
    with st.expander("Top image classifier predictions"):
        st.dataframe(
            [
                {
                    "Broad hazard category": item["category"],
                    "Model class": item["label"],
                    "Class confidence": f"{item['probability']:.1%}",
                }
                for item in vision["top_predictions"]
            ],
            hide_index=True,
            use_container_width=True,
        )


def _build_image_only_review(image_bytes: bytes) -> dict:
    """Validate and classify an image without running environmental scoring."""
    preflight = validate_image(image_bytes)
    return {
        "image_sha256": hashlib.sha256(image_bytes).hexdigest(),
        "image_metadata": extract_image_metadata(image_bytes),
        "preflight": {
            "width": preflight.width,
            "height": preflight.height,
            "format": preflight.image_format,
            "blur_variance": preflight.blur_variance,
        },
        "vision": _engine.score_image(image_bytes),
    }


def _resolve_photo_location(
    image_metadata: dict,
    location_choice: str,
    ip_lookup_consent: bool,
    manual_coordinates_confirmed: bool,
    manual_latitude: Optional[float],
    manual_longitude: Optional[float],
) -> dict:
    """Choose EXIF, opted-in IP, or explicitly confirmed manual map coordinates."""
    metadata = dict(image_metadata)
    if metadata.get("latitude") is not None and metadata.get("longitude") is not None:
        metadata["location_source"] = "exif"
        metadata["location_accuracy"] = "Camera-provided coordinates; accuracy unknown"
        return metadata

    metadata["latitude"] = None
    metadata["longitude"] = None
    metadata["location_source"] = None
    metadata["location_accuracy"] = None

    if location_choice == "Approximate current network location (IP)":
        if not ip_lookup_consent:
            return metadata
        coordinates = fetch_ip_coordinates()
        metadata.update(coordinates)
        metadata["location_source"] = "ip"
        metadata["location_accuracy"] = "Approximate public-IP location"
    elif (
        location_choice == "Enter coordinates manually"
        and manual_coordinates_confirmed
        and manual_latitude is not None
        and manual_longitude is not None
        and -90 <= manual_latitude <= 90
        and -180 <= manual_longitude <= 180
    ):
        metadata["latitude"] = float(manual_latitude)
        metadata["longitude"] = float(manual_longitude)
        metadata["location_source"] = "manual"
        metadata["location_accuracy"] = "User-entered coordinates"
    return metadata


def _make_crisis_map_pin(
    image_metadata: dict, vision: dict, image_sha256: str
) -> Optional[dict]:
    """Create a session map pin only when EXIF contains valid GPS coordinates."""
    latitude = image_metadata.get("latitude")
    longitude = image_metadata.get("longitude")
    if latitude is None or longitude is None:
        return None

    label = vision["target_label"]
    return {
        "image_sha256": image_sha256,
        "latitude": float(latitude),
        "longitude": float(longitude),
        "category": vision["target_category"],
        "model_label": label,
        "captured_at": image_metadata.get("captured_at"),
        "capture_time_timezone_known": image_metadata.get(
            "capture_time_timezone_known", False
        ),
        "location_source": image_metadata.get("location_source", "exif"),
        "location_accuracy": image_metadata.get("location_accuracy"),
        "image_only_estimate_pct": vision.get("image_only_estimate_pct"),
        "color": _MAP_COLORS.get(label, [100, 116, 139, 210]),
        "pinned_at": datetime.now(timezone.utc).isoformat(),
    }


def _store_crisis_map_pin(
    image_metadata: dict, vision: dict, image_sha256: str
) -> bool:
    """Keep deduplicated photo pins in this Streamlit session only."""
    pin = _make_crisis_map_pin(image_metadata, vision, image_sha256)
    pins = st.session_state.get("crisis_map_pins", [])
    pins = [item for item in pins if item["image_sha256"] != image_sha256]
    if pin is None:
        st.session_state["crisis_map_pins"] = pins
        return False
    pins.append(pin)
    st.session_state["crisis_map_pins"] = pins[-_MAX_SESSION_MAP_PINS:]
    return True


def _render_crisis_map() -> None:
    """Render EXIF-located image classifications on an interactive session map."""
    st.subheader("Interactive global crisis map")
    st.caption(
        "Photo pins stay in this browser session; images and EXIF metadata are "
        "not saved to a shared database. The map uses public CARTO basemap tiles."
    )
    pins = st.session_state.get("crisis_map_pins", [])
    if not pins:
        st.info(
            "Review or assess an image with EXIF GPS or user-confirmed coordinates "
            "to add its category to this map."
        )
        return

    locations = [
        {
            **pin,
            "tooltip_time": escape(pin["captured_at"] or "Not present in EXIF"),
            "tooltip_category": escape(pin["category"]),
            "tooltip_accuracy": escape(pin.get("location_accuracy") or "Unknown location source"),
        }
        for pin in pins
    ]
    latest = locations[-1]
    view_state = pdk.ViewState(
        latitude=latest["latitude"],
        longitude=latest["longitude"],
        zoom=4 if len(locations) == 1 else 2,
        pitch=0,
    )
    layer = pdk.Layer(
        "ScatterplotLayer",
        data=locations,
        get_position="[longitude, latitude]",
        get_fill_color="color",
        get_radius=12000,
        radius_min_pixels=7,
        radius_max_pixels=24,
        pickable=True,
        auto_highlight=True,
    )
    deck = pdk.Deck(
        layers=[layer],
        initial_view_state=view_state,
        map_style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        tooltip={
            "html": (
                "<b>{tooltip_category}</b><br/>"
                "Captured: {tooltip_time}<br/>"
                "Location: {tooltip_accuracy}<br/>"
                "Lat/Lon: {latitude}, {longitude}"
            ),
            "style": {"color": "#fff"},
        },
    )
    st.pydeck_chart(deck, use_container_width=True, height=480)
    st.dataframe(
        [
            {
                "Category": pin["category"],
                "Captured (EXIF)": pin["captured_at"] or "Unavailable",
                "Latitude": round(pin["latitude"], 5),
                "Longitude": round(pin["longitude"], 5),
                "Location source": pin.get("location_accuracy") or "EXIF",
            }
            for pin in pins
        ],
        hide_index=True,
        use_container_width=True,
    )


def _start_image_only_review() -> None:
    """Keep the image-only action separate from any prior site assessment."""
    st.session_state["image_only_review_mode"] = True
    st.session_state.pop("assessment_report", None)
    st.session_state.pop("assessment_input_signature", None)
    st.session_state.pop("image_review", None)


@api.get("/health")
async def health() -> dict:
    """Return service status without triggering model downloads."""
    return {"status": "ok", "vision_model_loaded": _engine._vision_model is not None}


@api.get("/weather")
async def weather(
    location: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
) -> dict:
    """Fetch a city or GPS-based weather baseline from Open-Meteo."""
    _validate_coordinates(latitude, longitude)
    if not location and latitude is None:
        raise HTTPException(
            status_code=422, detail="Provide a city name or a latitude/longitude pair."
        )
    try:
        return await fetch_weather(location, latitude, longitude)
    except WeatherLookupError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@api.post("/assess")
async def assess(
    image: Optional[UploadFile] = File(default=None),
    rain_24h_mm: Optional[float] = Form(default=None),
    slope_angle_deg: Optional[float] = Form(default=None),
    soil_moisture_pct: Optional[float] = Form(default=None),
    wind_speed_kmh: Optional[float] = Form(default=None),
    ground_temp_c: Optional[float] = Form(default=None),
    location: Optional[str] = Form(default=None),
    latitude: Optional[float] = Form(default=None),
    longitude: Optional[float] = Form(default=None),
) -> dict:
    """Assess one site, using weather data only for explicitly omitted readings."""
    _validate_coordinates(latitude, longitude)

    weather_data = None
    if location or latitude is not None:
        try:
            weather_data = await fetch_weather(location, latitude, longitude)
        except WeatherLookupError as exc:
            raise HTTPException(status_code=502, detail=str(exc)) from exc

    metric_values: Dict[str, Optional[float]] = {
        "rain_24h_mm": rain_24h_mm,
        "slope_angle_deg": slope_angle_deg,
        "soil_moisture_pct": soil_moisture_pct,
        "wind_speed_kmh": wind_speed_kmh,
        "ground_temp_c": ground_temp_c,
    }
    if weather_data:
        metric_values["rain_24h_mm"] = (
            rain_24h_mm
            if rain_24h_mm is not None
            else weather_data["rain_24h_mm"]
        )
        metric_values["wind_speed_kmh"] = (
            wind_speed_kmh
            if wind_speed_kmh is not None
            else weather_data["wind_speed_kmh"]
        )

    missing = [name for name, value in metric_values.items() if value is None]
    if missing:
        raise HTTPException(
            status_code=422,
            detail=(
                "Provide all site measurements, or provide a location so current "
                "weather can fill rainfall and wind speed. Missing: "
                + ", ".join(missing)
            ),
        )
    try:
        metrics = RiskMetrics(**metric_values)
    except ValidationError as exc:
        details = [
            {
                "field": ".".join(str(part) for part in error["loc"]),
                "message": error["msg"],
                "type": error["type"],
            }
            for error in exc.errors()
        ]
        raise HTTPException(status_code=422, detail=details) from exc

    preflight = None
    image_bytes = None
    if image is not None:
        try:
            image_bytes = await image.read(MAX_IMAGE_BYTES + 1)
            if len(image_bytes) > MAX_IMAGE_BYTES:
                raise HTTPException(
                    status_code=413, detail="Image exceeds the 25 MB upload limit."
                )
            preflight = validate_image(image_bytes)
        except ImageValidationError as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc
        finally:
            await image.close()

    try:
        return await run_in_threadpool(
            _build_assessment_report,
            metrics,
            weather_data,
            location,
            latitude,
            longitude,
            image_bytes,
            preflight,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


def _render_environmental_assessment_dashboard() -> None:
    """Retained legacy dashboard; the public Streamlit entry point is image-only."""
    st.set_page_config(page_title="Disaster Risk Assessment", page_icon="🌦️", layout="wide")
    st.title("Multimodal Disaster Risk Assessment")
    st.caption(
        "Educational site screening only — not an official alert or a substitute "
        "for emergency services."
    )
    st.subheader("Site location and weather baseline")
    location_mode = st.radio(
        "Location input", ("City name", "GPS coordinates"), horizontal=True
    )
    location = None
    latitude = None
    longitude = None
    if location_mode == "City name":
        location = st.text_input("City or place name", key="location_name")
    else:
        coordinate_columns = st.columns(2)
        latitude = coordinate_columns[0].number_input(
            "Latitude", min_value=-90.0, max_value=90.0, value=20.5937, format="%.5f"
        )
        longitude = coordinate_columns[1].number_input(
            "Longitude", min_value=-180.0, max_value=180.0, value=78.9629, format="%.5f"
        )

    if st.button("Fetch live weather baseline"):
        if location_mode == "City name":
            params = {"location": location} if location else {}
        else:
            params = {"latitude": latitude, "longitude": longitude}
        if not params:
            st.error("Enter a city name before fetching its weather.")
        else:
            try:
                baseline = asyncio.run(
                    fetch_weather(
                        location=location if location_mode == "City name" else None,
                        latitude=latitude if location_mode == "GPS coordinates" else None,
                        longitude=longitude if location_mode == "GPS coordinates" else None,
                    )
                )
                st.session_state["rain_24h_mm"] = float(baseline["rain_24h_mm"])
                st.session_state["wind_speed_kmh"] = float(
                    baseline["wind_speed_kmh"]
                )
                st.session_state["weather_baseline"] = baseline
                st.success(
                    f"Weather loaded for {baseline['location_name']}. "
                    "Rainfall and wind sliders were updated; ground temperature "
                    "remains a separate manual measurement."
                )
            except WeatherLookupError as exc:
                st.error(f"Could not fetch the weather baseline: {exc}")
            except (KeyError, ValueError) as exc:
                st.error(f"The weather service returned incomplete data: {exc}")

    if st.session_state.get("weather_baseline"):
        baseline = st.session_state["weather_baseline"]
        st.info(
            f"Weather baseline for {baseline['location_name']}: "
            f"{baseline['air_temperature_c']:.1f} °C air, "
            f"{baseline['relative_humidity_pct']:.0f}% humidity; "
            f"observed {baseline['observed_at']} ({baseline['source']}). "
            "Ground temperature is not inferred from air temperature."
        )

    st.subheader("Environmental measurements")
    metric_columns = st.columns(2)
    location_ready = (
        location_mode == "GPS coordinates"
        or (location_mode == "City name" and bool(location))
    )
    use_live_weather = st.checkbox(
        "Use fresh weather data for rainfall and wind when assessing a location",
        value=True,
        disabled=not location_ready,
    )
    rain = metric_columns[0].slider(
        "24-hour rainfall (mm)",
        min_value=0.0,
        max_value=1000.0,
        value=float(st.session_state.get("rain_24h_mm", 25.0)),
        step=1.0,
        key="rain_24h_mm",
        disabled=use_live_weather and location_ready,
    )
    slope = metric_columns[1].slider(
        "Slope angle (degrees)", 0.0, 90.0, 15.0, 1.0
    )
    moisture = metric_columns[0].slider(
        "Soil moisture index (%)", 0.0, 100.0, 40.0, 1.0
    )
    wind = metric_columns[1].slider(
        "Wind speed (km/h)",
        min_value=0.0,
        max_value=400.0,
        value=float(st.session_state.get("wind_speed_kmh", 20.0)),
        step=1.0,
        key="wind_speed_kmh",
        disabled=use_live_weather and location_ready,
    )
    ground_temperature = st.slider(
        "Ground temperature (°C)", -60.0, 70.0, 20.0, 1.0
    )
    preview_metrics = {
        "rain_24h_mm": rain,
        "slope_angle_deg": slope,
        "soil_moisture_pct": moisture,
        "wind_speed_kmh": wind,
        "ground_temp_c": ground_temperature,
    }
    if not st.session_state.get("image_only_review_mode", False):
        preview_score, _ = _engine.score_environment(preview_metrics)
        preview_percent = round(preview_score * 100, 1)
        st.metric("Live environmental screening estimate", f"{preview_percent:.1f}%")
        st.progress(preview_percent / 100.0)
        st.caption(
            "Draft tabular-only score from the displayed measurements. If live weather "
            "is enabled, fresh rainfall and wind values are applied when you submit."
        )

    uploaded_file = st.file_uploader(
        "Environmental image (optional)",
        type=["jpg", "jpeg", "png"],
        help="JPEG or PNG only; maximum 25 MB. The app checks it before inference.",
    )
    if uploaded_file is not None and uploaded_file.size > MAX_IMAGE_BYTES:
        st.error("Image exceeds the 25 MB upload limit.")
        image_bytes = None
    else:
        image_bytes = uploaded_file.getvalue() if uploaded_file is not None else None
    if image_bytes:
        if is_previewable_image(image_bytes):
            st.image(
                image_bytes,
                caption="Uploaded image — shown as received, before analysis",
                use_container_width=True,
            )
        else:
            st.warning(
                "The uploaded file could not be safely previewed. Image validation "
                "will reject it before assessment."
            )

    pin_location_choice = "Don't pin"
    ip_lookup_consent = False
    manual_coordinates_confirmed = False
    manual_latitude = None
    manual_longitude = None
    uploaded_image_metadata = (
        extract_image_metadata(image_bytes) if image_bytes is not None else None
    )
    if uploaded_image_metadata and uploaded_image_metadata["latitude"] is None:
        image_key = hashlib.sha256(image_bytes).hexdigest()[:12]
        st.markdown("**Photo location for the map**")
        pin_location_choice = st.radio(
            "Where was this photo taken?",
            (
                "Don't pin",
                "Approximate current network location (IP)",
                "Enter coordinates manually",
            ),
            key=f"photo_location_choice_{image_key}",
            help=(
                "If the photo has no GPS metadata, choose an approximate location "
                "or enter coordinates for where the photo was taken."
            ),
        )
        if pin_location_choice == "Approximate current network location (IP)":
            st.warning(
                "IP-based location is approximate and may identify your network "
                "rather than the photo's exact location. If you continue, this app "
                "will send your public IP to ipapi.co, and to ipwho.is only if "
                "ipapi.co cannot provide coordinates."
            )
            ip_lookup_consent = st.checkbox(
                "I agree to look up an approximate location using this network's IP.",
                value=False,
                key=f"photo_ip_consent_{image_key}",
            )
        elif pin_location_choice == "Enter coordinates manually":
            coordinate_columns = st.columns(2)
            manual_latitude = coordinate_columns[0].number_input(
                "Photo latitude",
                min_value=-90.0,
                max_value=90.0,
                value=0.0,
                step=0.0001,
                format="%.5f",
                key=f"photo_manual_lat_{image_key}",
            )
            manual_longitude = coordinate_columns[1].number_input(
                "Photo longitude",
                min_value=-180.0,
                max_value=180.0,
                value=0.0,
                step=0.0001,
                format="%.5f",
                key=f"photo_manual_lon_{image_key}",
            )
            manual_coordinates_confirmed = st.checkbox(
                "These coordinates are where this photo was taken.",
                value=False,
                key=f"photo_manual_confirm_{image_key}",
            )

    dashboard_metrics = {
        "rain_24h_mm": rain,
        "slope_angle_deg": slope,
        "soil_moisture_pct": moisture,
        "wind_speed_kmh": wind,
        "ground_temp_c": ground_temperature,
    }
    input_signature = _dashboard_input_signature(
        dashboard_metrics,
        image_bytes,
        location if location_mode == "City name" else None,
        latitude if location_mode == "GPS coordinates" else None,
        longitude if location_mode == "GPS coordinates" else None,
        use_live_weather,
    )

    image_review_column, assessment_column = st.columns(2)
    with image_review_column:
        review_image_clicked = st.button(
            "Review image only",
            disabled=image_bytes is None,
            help="Analyze the uploaded image without calculating an environmental risk index.",
            on_click=_start_image_only_review,
        )
    with assessment_column:
        assess_risk_clicked = st.button("Assess disaster risk", type="primary")

    if review_image_clicked:
        if image_bytes is None:
            st.error("Upload a valid image before starting an image-only review.")
            return
        try:
            image_review = _build_image_only_review(image_bytes)
            image_review["image_metadata"] = _resolve_photo_location(
                image_review["image_metadata"],
                pin_location_choice,
                ip_lookup_consent,
                manual_coordinates_confirmed,
                manual_latitude,
                manual_longitude,
            )
            image_review["map_pin_added"] = _store_crisis_map_pin(
                image_review["image_metadata"],
                image_review["vision"],
                image_review["image_sha256"],
            )
            st.session_state["image_review"] = image_review
            if not image_review["map_pin_added"]:
                st.info(
                    "No map pin was added. Choose a location option and confirm "
                    "it, or continue without pinning."
                )
        except ImageValidationError as exc:
            st.error(str(exc))
            return
        except IPGeolocationError as exc:
            st.warning(f"Image review completed without a map pin: {exc}")
            if "image_review" in locals():
                image_review["image_metadata"]["latitude"] = None
                image_review["image_metadata"]["longitude"] = None
                image_review["image_metadata"]["location_source"] = None
                image_review["map_pin_added"] = False
                _store_crisis_map_pin(
                    image_review["image_metadata"],
                    image_review["vision"],
                    image_review["image_sha256"],
                )
                st.session_state["image_review"] = image_review
        except (ValueError, RuntimeError) as exc:
            st.error(f"Image review could not run: {exc}")
            return

    if assess_risk_clicked:
        st.session_state["image_only_review_mode"] = False
        st.session_state.pop("assessment_report", None)
        st.session_state.pop("assessment_input_signature", None)
        st.session_state.pop("image_review", None)
        if uploaded_file is not None and uploaded_file.size > MAX_IMAGE_BYTES:
            st.error("Choose an image smaller than 25 MB.")
            return
        preflight = None
        if image_bytes:
            try:
                preflight = validate_image(image_bytes)
                st.caption(
                    f"Image preflight passed: {preflight.width} × {preflight.height} "
                    f"{preflight.image_format}; blur variance "
                    f"{preflight.blur_variance:.1f}."
                )
            except ImageValidationError as exc:
                st.error(str(exc))
                return

        weather_data = None
        try:
            if use_live_weather and location_ready:
                weather_data = asyncio.run(
                    fetch_weather(
                        location=location if location_mode == "City name" else None,
                        latitude=latitude if location_mode == "GPS coordinates" else None,
                        longitude=longitude if location_mode == "GPS coordinates" else None,
                    )
                )
                st.session_state["weather_baseline"] = weather_data
            metrics = RiskMetrics(
                rain_24h_mm=(
                    weather_data["rain_24h_mm"] if weather_data else rain
                ),
                slope_angle_deg=slope,
                soil_moisture_pct=moisture,
                wind_speed_kmh=(
                    weather_data["wind_speed_kmh"] if weather_data else wind
                ),
                ground_temp_c=ground_temperature,
            )
            st.session_state["assessment_report"] = _build_assessment_report(
                metrics=metrics,
                weather_data=weather_data,
                location=location if location_mode == "City name" else None,
                latitude=latitude if location_mode == "GPS coordinates" else None,
                longitude=longitude if location_mode == "GPS coordinates" else None,
                image_bytes=image_bytes,
                preflight=preflight,
            )
            if image_bytes and st.session_state["assessment_report"]["vision"]:
                report = st.session_state["assessment_report"]
                try:
                    report["image_metadata"] = _resolve_photo_location(
                        report["image_metadata"],
                        pin_location_choice,
                        ip_lookup_consent,
                        manual_coordinates_confirmed,
                        manual_latitude,
                        manual_longitude,
                    )
                except IPGeolocationError as exc:
                    st.warning(
                        f"Assessment completed without an IP-based map pin: {exc}"
                    )
                pin_added = _store_crisis_map_pin(
                    report["image_metadata"],
                    report["vision"],
                    hashlib.sha256(image_bytes).hexdigest(),
                )
                if not pin_added:
                    st.info(
                        "No map pin was added. Choose a location option and "
                        "confirm it, or continue without pinning."
                    )
            st.session_state["assessment_input_signature"] = input_signature
        except WeatherLookupError as exc:
            st.error(f"Could not fetch live weather: {exc}")
            return
        except ValidationError as exc:
            st.error(f"Invalid site measurements: {exc}")
            return
        except ValueError as exc:
            st.error(str(exc))
            return
        except RuntimeError as exc:
            st.error(f"Image inference could not run: {exc}")
            return

    image_review = st.session_state.get("image_review")
    if (
        image_review
        and image_bytes is not None
        and image_review["image_sha256"] == hashlib.sha256(image_bytes).hexdigest()
    ):
        st.subheader("Image-only review")
        preflight = image_review["preflight"]
        st.caption(
            f"Image preflight passed: {preflight['width']} × {preflight['height']} "
            f"{preflight['format']}; blur variance "
            f"{preflight['blur_variance']:.1f}. No environmental risk index "
            "was calculated."
        )
        _render_image_review(
            image_review["vision"],
            image_bytes,
            image_metadata=image_review["image_metadata"],
        )

    report = (
        st.session_state.get("assessment_report")
        if st.session_state.get("assessment_input_signature") == input_signature
        else None
    )
    if report:
        fusion = report["fusion"]
        score_column, level_column = st.columns(2)
        score_column.metric("Disaster Risk Index", f"{fusion['risk_index_pct']:.1f}%")
        badge_colors = {
            "Low": "#238636",
            "Moderate": "#9a6700",
            "High": "#d1242f",
            "Extreme": "#8e1b10",
        }
        level = fusion["alert_level"]
        level_column.markdown(
            f'<div style="padding: 0.65rem 0.9rem; border-radius: 0.5rem; '
            f'background: {badge_colors[level]}; color: white; font-weight: 700; '
            f'text-align: center;">{level.upper()} RISK</div>',
            unsafe_allow_html=True,
        )
        st.progress(fusion["risk_index_pct"] / 100.0)
        if report["vision"] is not None:
            vision = report["vision"]
            if vision["included_in_fusion"]:
                st.write(
                    f"Vision model score: {vision['score']:.0%} · "
                    f"Environmental score: {report['tabular']['score']:.0%}"
                )
            else:
                st.warning(
                    vision["exclusion_reason"]
                    + " The assessment completed using environmental "
                    "measurements only."
                )
                st.caption(
                    f"Environmental score used for this assessment: "
                    f"{report['tabular']['score']:.0%}"
                )
            _render_image_review(
                vision,
                image_bytes,
                image_metadata=report["image_metadata"],
                included_in_fusion=vision["included_in_fusion"],
            )
        else:
            st.write(
                f"Environmental score: {report['tabular']['score']:.0%} "
                "(no image supplied; tabular score uses the full index)."
            )

        st.subheader("Safety checklist")
        for action in report["safety_checklist"]:
            st.markdown(f"- {action}")
        with st.expander("Assessment details and limitations"):
            details = json.loads(json.dumps(report))
            if details.get("vision"):
                details["vision"]["explanation_image_base64"] = (
                    "Omitted from on-screen details; included in downloaded JSON."
                )
            st.json(details)
        st.download_button(
            "Download assessment JSON",
            data=json.dumps(report, indent=2),
            file_name=f"disaster-risk-{report['assessment_id']}.json",
            mime="application/json",
        )

    _render_crisis_map()


def render_dashboard() -> None:
    """Render the image-only disaster analyzer and session crisis map."""
    st.set_page_config(
        page_title="Disaster Image Analyzer",
        page_icon="🌦️",
        layout="wide",
    )
    st.markdown(
        """
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

        :root {
            --dr-navy: #10243a;
            --dr-navy-soft: #1c3551;
            --dr-orange: #f39c35;
            --dr-grey: #f4f6f8;
            --dr-text: #1a2430;
            --dr-muted: #5d6f82;
        }

        [data-testid="stAppViewContainer"] {
            background: var(--dr-grey);
            color: var(--dr-text);
            font-family: "Manrope", sans-serif;
        }

        [data-testid="stHeader"] {
            background: transparent;
        }

        [data-testid="stMainBlockContainer"] {
            max-width: 1120px;
            padding-top: 2rem;
            padding-bottom: 3rem;
        }

        h1, h2, h3, p, label {
            font-family: "Manrope", sans-serif;
        }

        h1, h2, h3 {
            color: var(--dr-navy);
        }

        h1 {
            font-size: clamp(2rem, 4vw, 3rem);
            font-weight: 800;
        }

        .disasterready-kicker {
            margin: 0 0 0.4rem;
            color: var(--dr-orange);
            font-size: 0.78rem;
            font-weight: 800;
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }

        .disasterready-upload-heading {
            margin: 1.8rem 0 0.65rem;
        }

        .disasterready-upload-heading h2 {
            margin: 0;
            color: var(--dr-navy);
            font-size: 1.3rem;
            font-weight: 800;
        }

        .disasterready-upload-heading p {
            margin: 0.2rem 0 0;
            color: var(--dr-muted);
            font-size: 0.88rem;
        }

        [data-testid="stFileUploader"],
        [data-testid="stExpander"] {
            border-radius: 16px;
        }

        div.stButton > button[kind="primary"] {
            border: 0;
            border-radius: 999px;
            background: var(--dr-orange);
            color: #fff;
            font-weight: 800;
        }

        div.stButton > button[kind="primary"]:hover {
            border: 0;
            background: #df8520;
            color: #fff;
        }
        </style>
        """,
        unsafe_allow_html=True,
    )
    st.markdown(
        '<p class="disasterready-kicker">DisasterReady · Image Analyzer</p>',
        unsafe_allow_html=True,
    )
    st.title("    Disaster Image Analyzer")
    st.caption(
        "Classify an uploaded image and estimate its disaster-related signal. "
        "This is an educational screening aid, not an official warning."
    )
    st.info(
        "The image score is based only on the classifier output. It is not a "
        "calibrated probability that a disaster is occurring."
    )

    st.markdown(
        """
        <div class="disasterready-upload-heading">
          <h2>Upload a disaster image</h2>
          <p>JPEG or PNG · Up to 25 MB · Analysis runs locally</p>
        </div>
        """,
        unsafe_allow_html=True,
    )
    uploaded_file = st.file_uploader(
        "Disaster image",
        type=["jpg", "jpeg", "png"],
        help="JPEG or PNG only; maximum 25 MB.",
    )
    image_bytes = None
    if uploaded_file is not None:
        if uploaded_file.size > MAX_IMAGE_BYTES:
            st.error("Image exceeds the 25 MB upload limit.")
        else:
            image_bytes = uploaded_file.getvalue()
            if is_previewable_image(image_bytes):
                st.image(
                    image_bytes,
                    caption="Uploaded image",
                    use_container_width=True,
                )
            else:
                st.warning(
                    "This file cannot be previewed safely. The analyzer will "
                    "validate it before inference."
                )

    pin_location_choice = "Don't pin"
    ip_lookup_consent = False
    manual_coordinates_confirmed = False
    manual_latitude = None
    manual_longitude = None
    uploaded_image_metadata = (
        extract_image_metadata(image_bytes) if image_bytes is not None else None
    )
    if uploaded_image_metadata and uploaded_image_metadata["latitude"] is None:
        image_key = hashlib.sha256(image_bytes).hexdigest()[:12]
        st.markdown("**Photo location for the map (optional)**")
        pin_location_choice = st.radio(
            "Where was this photo taken?",
            (
                "Don't pin",
                "Approximate current network location (IP)",
                "Enter coordinates manually",
            ),
            key=f"photo_location_choice_{image_key}",
        )
        if pin_location_choice == "Approximate current network location (IP)":
            st.warning(
                "IP location is approximate and may identify your network, not "
                "the photo's location. Continuing sends your public IP to ipapi.co, "
                "and to ipwho.is only if ipapi.co cannot provide coordinates."
            )
            ip_lookup_consent = st.checkbox(
                "I agree to look up an approximate location using this network's IP.",
                key=f"photo_ip_consent_{image_key}",
            )
        elif pin_location_choice == "Enter coordinates manually":
            coordinate_columns = st.columns(2)
            manual_latitude = coordinate_columns[0].number_input(
                "Photo latitude",
                min_value=-90.0,
                max_value=90.0,
                value=0.0,
                step=0.0001,
                format="%.5f",
                key=f"photo_manual_lat_{image_key}",
            )
            manual_longitude = coordinate_columns[1].number_input(
                "Photo longitude",
                min_value=-180.0,
                max_value=180.0,
                value=0.0,
                step=0.0001,
                format="%.5f",
                key=f"photo_manual_lon_{image_key}",
            )
            manual_coordinates_confirmed = st.checkbox(
                "These coordinates are where this photo was taken.",
                key=f"photo_manual_confirm_{image_key}",
            )

    analyze_clicked = st.button(
        "Analyze image",
        type="primary",
        disabled=image_bytes is None,
    )
    if analyze_clicked and image_bytes is not None:
        try:
            image_review = _build_image_only_review(image_bytes)
            try:
                image_review["image_metadata"] = _resolve_photo_location(
                    image_review["image_metadata"],
                    pin_location_choice,
                    ip_lookup_consent,
                    manual_coordinates_confirmed,
                    manual_latitude,
                    manual_longitude,
                )
            except IPGeolocationError as exc:
                st.warning(f"Analysis completed without an IP-based pin: {exc}")
                image_review["image_metadata"] = _resolve_photo_location(
                    image_review["image_metadata"],
                    "Don't pin",
                    False,
                    False,
                    None,
                    None,
                )

            image_review["map_pin_added"] = _store_crisis_map_pin(
                image_review["image_metadata"],
                image_review["vision"],
                image_review["image_sha256"],
            )
            st.session_state["image_review"] = image_review
            if not image_review["map_pin_added"]:
                st.info(
                    "No map pin was added. A location was not available or confirmed."
                )
        except ImageValidationError as exc:
            st.session_state.pop("image_review", None)
            st.error(str(exc))
        except (ValueError, RuntimeError) as exc:
            st.session_state.pop("image_review", None)
            st.error(f"Image analysis could not run: {exc}")

    image_review = st.session_state.get("image_review")
    current_image_hash = (
        hashlib.sha256(image_bytes).hexdigest() if image_bytes is not None else None
    )
    if (
        image_review
        and image_review["image_sha256"] == current_image_hash
        and image_bytes is not None
    ):
        preflight = image_review["preflight"]
        st.caption(
            f"Preflight passed: {preflight['width']} × {preflight['height']} "
            f"{preflight['format']}; blur variance "
            f"{preflight['blur_variance']:.1f}."
        )
        _render_image_review(
            image_review["vision"],
            image_bytes,
            image_metadata=image_review["image_metadata"],
        )

    _render_crisis_map()


if __name__ == "__main__":
    render_dashboard()
