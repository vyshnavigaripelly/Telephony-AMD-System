from __future__ import annotations

import base64
import io
from typing import List

import numpy as np
import soundfile as sf
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="HF AMD Service", version="0.1.0")


class PredictRequest(BaseModel):
    frames: List[str]


class PredictResponse(BaseModel):
    label: str
    confidence: float


@app.get("/healthz")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest) -> PredictResponse:
    """Mock inference endpoint that averages audio energy as a heuristic."""
    if not request.frames:
        return PredictResponse(label="voicemail", confidence=0.1)

    audio = b"".join(base64.b64decode(frame) for frame in request.frames)
    wav_io = io.BytesIO(audio)
    data, _ = sf.read(wav_io)
    energy = float(np.abs(data).mean())

    if energy > 0.12:
        return PredictResponse(label="human", confidence=min(0.95, energy))
    return PredictResponse(label="voicemail", confidence=min(0.9, 0.5 + energy))
