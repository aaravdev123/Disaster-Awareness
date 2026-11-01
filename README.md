# Disaster Risk Assessment Platform

This Python application adds an educational, multimodal site-screening tool
alongside the existing DisasterReady website. It includes a local Streamlit
dashboard, an optional FastAPI API, a disaster-fine-tuned ResNet50 image model,
deterministic environmental scoring, and optional Open-Meteo weather baselines.

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
dashboard performs scoring and image inference in the same local process; it
does not require a cloud host or a separately running API. Disaster image
inference uses the bundled, inference-only ResNet50 weights at
[`assets/models/disaster_resnet50_fp16.pth`](./assets/models/disaster_resnet50_fp16.pth)
(about 45 MiB). The checkpoint loads locally with PyTorch's
`weights_only=True` mode; it is not downloaded from Hugging Face at runtime.

After installing Python packages, live weather is the only feature that needs
internet access. Weather lookup is optional and uses the public Open-Meteo
geocoding and forecast APIs. To run fully offline, leave live weather disabled
and enter site measurements manually.

The uploader accepts JPEG and PNG files up to 10 MB. The dashboard checks image
format, size, decodeability, dimensions, and blur before inference. Weather can
be queried by place name or latitude/longitude. Rainfall and wind can be filled
from the returned baseline; soil moisture, slope, and ground temperature remain
site measurements.

Uploaded images are previewed before analysis. Image inference requires at least
one high-confidence disaster class (`Earthquake`, `Fire`, or `Flood`); images
classified as `Non-Damage` or below 90% class confidence are rejected and the
predictions are shown. Accepted images display the original beside a Grad-CAM
attention overlay, highlighted regions, pixel bounds, and the classifier labels
that influenced the result. These boxes explain classifier attention; they are
not object detections or verified hazard boundaries.

The vision checkpoint is
[`DanielCruz09/disaster-image-classifier`](https://huggingface.co/DanielCruz09/disaster-image-classifier),
a ResNet50 fine-tuned for `Earthquake`, `Fire`, `Flood`, and `Non-Damage` classes
using an AIDERv2-based aerial-image dataset. Its model card reports training
details but does not publish numeric evaluation results; it is a community model,
not independently validated by this project. The training dataset is described
at [DanielCruz09/natural_disasters](https://huggingface.co/datasets/DanielCruz09/natural_disasters)
and is based on AIDERv2. The dataset card declares CC BY 4.0; the model card
declares BSD-3-Clause. This repository bundles that publisher-trained checkpoint
in FP16 storage format; it was not trained or fine-tuned on this computer.
See [`assets/models/model-provenance.json`](./assets/models/model-provenance.json)
for the pinned source revision and bundled-file SHA-256.

## Optional API

If another local program needs HTTP access, start the optional API in a separate
terminal:

```bash
uvicorn app:api --host 127.0.0.1 --port 8000
```

The API provides `GET /health`, `GET /weather`, `POST /assess`, and interactive
documentation at `/docs`. The dashboard itself does not call these endpoints.

## Important limitations

This is a screening and preparedness aid, not an operational early-warning
system. The tabular score uses hand-set, interpretable thresholds; it has not
been trained or calibrated against disaster outcomes. The community disaster
classifier is fine-tuned on aerial imagery for four classes, but numeric
evaluation results are not published in its model card. It may not generalize
to ground-level photos, and its class score is not a calibrated probability of
disaster severity. The 90% confidence gate is a conservative heuristic, not a reliable
out-of-distribution detector. Grad-CAM rectangles show classifier attention
rather than verified objects or hazards. The 40%/60% fusion weights and alert
bands are product defaults, not validated safety thresholds.
Weather-provider values may not represent conditions at the exact site.

Do not use the index to make evacuation or emergency decisions. Always follow
official local authorities and emergency services. Before public deployment,
replace the heuristic models with locally validated, hazard-specific models;
add authentication, rate limiting, secure upload storage/retention controls,
monitoring, and a reviewed operational safety process.
