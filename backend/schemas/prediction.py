from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import IntEnum

class PredictionRecord(BaseModel):
    """Schema chính để lưu dữ liệu dự đoán"""
    id: str  # UUID
    prediction_date: datetime
    doctor_info: str
    image_url: str
    prediction_result: str
    probability: float
    ai_model: str

