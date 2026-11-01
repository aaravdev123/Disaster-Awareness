# Disaster Risk Assessment Platform

This Python service adds an educational, multimodal site-screening tool alongside
the existing DisasterReady website. It includes a FastAPI API, a Streamlit
dashboard, an EfficientNet-B0 image signal, deterministic environmental scoring,
and optional Open-Meteo weather baselines.

## Run locally

Use Python 3.9 or newer. Install the packages in `requirements.txt` in a virtual
environment:

```bash
python -m pip install -r requirements.txt
```

Start the API in one terminal:

```bash
uvicorn app:api --host 127.0.0.1 --port 8000
```

Start the dashboard in another terminal:

```bash
streamlit run app.py
```

The dashboard defaults to `http://127.0.0.1:8000`. Set `DISASTER_API_URL` if the
API is hosted elsewhere. The first assessment with an image downloads the
official torchvision EfficientNet-B0 ImageNet weights; later runs use the local
model cache. Weather lookup uses the public Open-Meteo geocoding and forecast
APIs and requires network access.

The uploader accepts JPEG and PNG files up to 10 MB. The dashboard performs
format, size, decode, dimensions, and blur checks before submission; the API
repeats these checks independently. Weather can be queried by place name or
latitude/longitude. Rainfall and wind can be filled from the returned baseline;
soil moisture, slope, and ground temperature remain site measurements.

## API

- `GET /health` checks service availability without loading model weights.
- `GET /weather?location=...` or `GET /weather?latitude=...&longitude=...`
  fetches a weather baseline.
- `POST /assess` accepts multipart measurements and an optional JPEG/PNG image.
  Supply all five measurements, or omit rainfall and wind when providing a
  location so they can be filled from live weather.
- Interactive API documentation is available at `/docs`.

## Important limitations

This is a screening and preparedness aid, not an operational early-warning
system. The tabular score uses hand-set, interpretable thresholds; it has not
been trained or calibrated against disaster outcomes. EfficientNet-B0 is
pretrained on ImageNet, not disaster imagery, and its visual score is only a
weak label-based proxy. Its low-confidence check is a heuristic, not a reliable
out-of-distribution detector. The 40%/60% fusion weights and alert bands are
product defaults, not validated safety thresholds. Weather-provider values may
not represent conditions at the exact site.

Do not use the index to make evacuation or emergency decisions. Always follow
official local authorities and emergency services. Before public deployment,
replace the heuristic models with locally validated, hazard-specific models;
add authentication, rate limiting, secure upload storage/retention controls,
monitoring, and a reviewed operational safety process.
