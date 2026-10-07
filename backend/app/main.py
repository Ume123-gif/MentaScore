from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import PredictRequest, PredictResponse
from app.model import predict_score


app = FastAPI(title="MentaScore API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)


@app.post("/api/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    result = predict_score(request)

    return {
        "score": result["score"],
        "contributions": result["contributions"],
        "source": "backend-model",
    }