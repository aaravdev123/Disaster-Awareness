"""FastAPI assessment service and Streamlit disaster-risk dashboard.

Run the API with ``uvicorn app:api`` and the dashboard with
``streamlit run app.py``. The dashboard sends assessments to the API process.
"""

from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from typing import Dict, Optional

import requests
import streamlit as st
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel, ConfigDict, Field, ValidationError
from starlette.responses import JSONResponse

from model_engine import MultimodalRiskEngine
from utils import (
    MAX_IMAGE_BYTES,
    ImageValidationError,
    WeatherLookupError,
    fetch_weather,
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
                content={"detail": "Request exceeds the 11 MB upload limit."},
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
                    status_code=413, detail="Image exceeds the 10 MB upload limit."
                )
            preflight = validate_image(image_bytes)
        except ImageValidationError as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc
        finally:
            await image.close()

    metric_dict = metrics.model_dump()
    tabular_score, tabular_components = _engine.score_environment(metric_dict)
    vision = None
    if image_bytes is not None:
        try:
            vision = await run_in_threadpool(_engine.score_image, image_bytes)
        except RuntimeError as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc
        if vision["out_of_domain"]:
            raise HTTPException(
                status_code=422,
                detail=(
                    "The vision model has low confidence that this image is within "
                    "its supported ImageNet label space. Try a clearer, relevant "
                    "environmental image or assess without an image."
                ),
            )

    if vision is None:
        risk_score = tabular_score * 100
        fusion_weights = {"vision": 0.0, "tabular": 1.0}
    else:
        risk_score = (0.40 * float(vision["score"]) + 0.60 * tabular_score) * 100
        fusion_weights = {"vision": 0.40, "tabular": 0.60}
    risk_score = round(risk_score, 1)
    level = _risk_level(risk_score)

    return {
        "assessment_id": os.urandom(8).hex(),
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
        "vision": vision,
        "tabular": {
            "score": round(tabular_score, 4),
            "component_signals": tabular_components,
            "method": "Weighted thresholds; not a trained or calibrated model",
        },
        "fusion": {
            "weights": fusion_weights,
            "risk_index_pct": risk_score,
            "alert_level": level,
        },
        "safety_checklist": _safety_checklist(level),
        "limitations": [
            "This educational screening tool is not an official forecast, warning, or evacuation instruction.",
            "EfficientNet-B0 is ImageNet-pretrained, not disaster-trained; its visual score is a weak proxy.",
            "The tabular score uses transparent heuristic thresholds and is not empirically calibrated.",
            "Weather readings are provider baselines and may differ from conditions at the site.",
            "Follow local emergency services and official weather authorities.",
        ],
    }


def render_dashboard() -> None:
    """Render the Streamlit interface and send assessments to the FastAPI service."""
    st.set_page_config(page_title="Disaster Risk Assessment", page_icon="🌦️", layout="wide")
    st.title("Multimodal Disaster Risk Assessment")
    st.caption(
        "Educational site screening only — not an official alert or a substitute "
        "for emergency services."
    )
    api_url = os.getenv("DISASTER_API_URL", "http://127.0.0.1:8000").rstrip("/")

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
                response = requests.get(
                    f"{api_url}/weather", params=params, timeout=20
                )
                response.raise_for_status()
                baseline = response.json()
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
            except requests.RequestException as exc:
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
        help="JPEG or PNG only; maximum 10 MB. The server repeats all safety checks.",
    )
    if uploaded_file is not None and uploaded_file.size > MAX_IMAGE_BYTES:
        st.error("Image exceeds the 10 MB upload limit.")

    if st.button("Assess disaster risk", type="primary"):
        st.session_state.pop("assessment_report", None)
        if uploaded_file is not None and uploaded_file.size > MAX_IMAGE_BYTES:
            st.error("Choose an image smaller than 10 MB.")
            return
        image_bytes = uploaded_file.getvalue() if uploaded_file is not None else None
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

        form_data = {
            "slope_angle_deg": slope,
            "soil_moisture_pct": moisture,
            "ground_temp_c": ground_temperature,
        }
        if not (use_live_weather and location_ready):
            form_data["rain_24h_mm"] = rain
            form_data["wind_speed_kmh"] = wind
        if location_mode == "City name" and location:
            form_data["location"] = location
        elif location_mode == "GPS coordinates":
            form_data["latitude"] = latitude
            form_data["longitude"] = longitude

        files = (
            {
                "image": (
                    uploaded_file.name,
                    image_bytes,
                    uploaded_file.type or "application/octet-stream",
                )
            }
            if image_bytes
            else None
        )
        try:
            response = requests.post(
                f"{api_url}/assess",
                data=form_data,
                files=files,
                timeout=120,
            )
            response.raise_for_status()
            st.session_state["assessment_report"] = response.json()
        except requests.HTTPError as exc:
            try:
                detail = response.json().get("detail", str(exc))
            except ValueError:
                detail = str(exc)
            st.error(f"Assessment failed: {detail}")
            return
        except requests.RequestException as exc:
            st.error(f"Could not reach the assessment API at {api_url}: {exc}")
            return

    report = st.session_state.get("assessment_report")
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
            st.write(
                f"Vision proxy: {report['vision']['score']:.0%} · "
                f"Environmental score: {report['tabular']['score']:.0%}"
            )
            st.caption(
                "Vision labels: "
                + (
                    ", ".join(report["vision"]["matched_hazard_labels"])
                    or "no mapped hazard label detected"
                )
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
            st.json(report)
        st.download_button(
            "Download assessment JSON",
            data=json.dumps(report, indent=2),
            file_name=f"disaster-risk-{report['assessment_id']}.json",
            mime="application/json",
        )


if __name__ == "__main__":
    render_dashboard()
