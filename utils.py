"""Image validation and keyless Open-Meteo weather lookup utilities."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from io import BytesIO
import math
from typing import Optional

import cv2
import httpx
import numpy as np
from PIL import Image, UnidentifiedImageError


MAX_IMAGE_BYTES = 10 * 1024 * 1024
MAX_IMAGE_PIXELS = 40_000_000
MIN_BLUR_VARIANCE = 40.0
SUPPORTED_IMAGE_FORMATS = {"JPEG", "PNG"}


class ImageValidationError(ValueError):
    """Raised when an uploaded image is unsafe, corrupt, or unusable."""


class WeatherLookupError(RuntimeError):
    """Raised when a location or weather provider request cannot be completed."""


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
        raise ImageValidationError("Image exceeds the 10 MB upload limit.")

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
