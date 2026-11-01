# Disaster Risk Assessment Platform

This Python application adds an educational disaster-image analyzer alongside
the existing DisasterReady website. Its Streamlit dashboard accepts an image,
classifies its broad hazard category, estimates an image-only disaster signal,
and can add a location-aware pin to a session map. The optional FastAPI API
remains separate from the image-only dashboard.

## Run locally

Use Python 3.9 or newer. Install the packages in `requirements.txt` in a virtual
environment:

```bash
python -m pip install -r requirements.txt
```

Start the dashboard:

```bash
streamlit run app.py
```

Open the local URL printed by Streamlit, usually `http://localhost:8501`. The
dashboard runs inference locally and does not require the optional API. On first
image analysis, the app downloads the pinned `Luwayy/disaster_images_model` ViT
checkpoint (about 343 MB) from Hugging Face into its local cache. Later
inference uses the cached checkpoint locally; no hosted inference API is used.
Other computers also need a one-time download. The model weights are not
bundled in this repository because its model card does not declare a license
and the checkpoint exceeds GitHub's 100 MB per-file limit.

The uploader accepts JPEG and PNG files up to 25 MB. The dashboard checks image
format, size, decodeability, dimensions, and blur before analysis. Select
**Analyze image** to run inference. The dashboard displays
the original image, the model's image-only disaster estimate, its broad
category, predictions, and Grad-CAM attention regions. The estimate sums the
model's disaster-category probabilities; it is not a calibrated real-world
chance.
The dashboard translates the model's technical labels into broad categories
such as “Flooding and water-related hazards” and “Land and slope hazards.”
These categories are broad image classifications and should not be interpreted
as confirmation of a specific event.
When EXIF GPS and capture-time metadata are present, analyzing an image
automatically adds its category to an interactive map for this Streamlit
session. If GPS is missing, the user can choose not to pin, explicitly consent
to approximate public-IP geolocation, or enter and confirm coordinates for
where the photo was taken. IP-derived location is approximate and sends a
request to ipapi.co, with ipwho.is as a fallback if the first provider cannot
return coordinates. Both providers can see the public IP used by this local
app.
Coordinates are never guessed: without EXIF GPS or user-confirmed coordinates,
the photo is not pinned. Pins are held only in session memory (up to 100) and
are not written to a shared database; the map loads public CARTO basemap tiles.
Camera timestamps are shown as recorded, with timezone only when the image
provides it. Map tiles require internet; image analysis and EXIF extraction run
locally.

The image model is
[`Luwayy/disaster_images_model`](https://huggingface.co/Luwayy/disaster_images_model),
a Vision Transformer with six labels: `Damaged_Infrastructure`,
`Fire_Disaster`, `Human_Damage`, `Land_Disaster`, `Non_Damage`, and
`Water_Disaster`. The source model card reports three training epochs but does
not identify the training dataset, publish numeric evaluation results, or
declare a model license. This project pins the checkpoint revision and does not
bundle or redistribute its weights. Review the model's terms and suitability
before use or redistribution. See
[`assets/models/model-provenance.json`](./assets/models/model-provenance.json)
for the pinned revision and upstream checkpoint checksum.

## Optional API

If another local program needs HTTP access, start the optional API in a separate
terminal:

```bash
uvicorn app:api --host 127.0.0.1 --port 8000
```

The optional API provides `GET /health`, `GET /weather`, `POST /assess`, and
interactive documentation at `/docs`. It remains independent of the
image-only Streamlit dashboard.

## Important limitations

This is a screening and preparedness aid, not an operational early-warning
system. The community ViT model's
training data and numeric evaluation results are not documented in its model
card. It may not generalize to images unlike its training data, and its class
score is not a calibrated probability of disaster severity. The 90% confidence
gate is a conservative heuristic, not a reliable out-of-distribution detector.
Grad-CAM rectangles show classifier attention rather than verified objects or
hazards.

Do not use this image score to make evacuation or emergency decisions. Always follow
official local authorities and emergency services. Before public deployment,
replace the heuristic models with locally validated, hazard-specific models;
add authentication, rate limiting, secure upload storage/retention controls,
monitoring, and a reviewed operational safety process.
