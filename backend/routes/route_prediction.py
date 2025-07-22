from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import IntEnum


class BiRadsCategory(IntEnum):
    """BI-RADS Categories (0-5)"""
    INCOMPLETE = 0          # Cần đánh giá thêm
    NEGATIVE = 1           # Âm tính - Bình thường  
    BENIGN = 2             # Tổn thương lành tính
    PROBABLY_BENIGN = 3    # Có thể lành tính
    SUSPICIOUS = 4         # Nghi ngờ ác tính
    HIGHLY_SUSPICIOUS = 5  # Rất nghi ngờ ác tính


class PredictionProbability(BaseModel):
    """Xác suất dự đoán cho từng lớp BI-RADS"""
    class_id: BiRadsCategory
    class_name: str
    probability: float  # 0.0 - 1.0
    percentage: float   # 0.0 - 100.0


class AIModelInfo(BaseModel):
    """Thông tin về model AI được sử dụng"""
    model_name: str = "MammoAI"
    model_version: str = "v2.1"
    model_type: str = "CNN-BI-RADS"
    processing_time: float  # seconds


class ImageInfo(BaseModel):
    """Thông tin về ảnh X-quang"""
    original_filename: str
    file_size: int  # bytes
    image_width: Optional[int] = None
    image_height: Optional[int] = None
    file_format: str  # "jpg", "png", "dicom"
    s3_url: HttpUrl  # Public URL trên AWS S3
    s3_bucket: str
    s3_key: str


class DoctorInfo(BaseModel):
    """Thông tin bác sĩ thực hiện dự đoán"""
    doctor_id: str
    doctor_name: str
    doctor_email: Optional[str] = None
    specialization: Optional[str] = "Ung bướu"
    hospital: Optional[str] = None


class PatientInfo(BaseModel):
    """Thông tin bệnh nhân (tùy chọn)"""
    patient_id: Optional[str] = None
    patient_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = "Female"
    medical_record_number: Optional[str] = None


class PredictionResult(BaseModel):
    """Kết quả dự đoán chính"""
    predicted_class: BiRadsCategory
    confidence: float  # Độ tin cậy của dự đoán chính (0.0 - 1.0)
    probability_distribution: List[PredictionProbability]
    risk_level: str  # "Low", "Medium", "High"
    recommendation: str  # Khuyến nghị lâm sàng


class PredictionRecord(BaseModel):
    """Schema chính để lưu dữ liệu dự đoán"""
    id: str  # UUID
    prediction_date: datetime
    doctor_info: DoctorInfo
    image_info: ImageInfo
    prediction_result: PredictionResult
    ai_model_info: AIModelInfo
    patient_info: Optional[PatientInfo] = None
    notes: Optional[str] = None  # Ghi chú của bác sĩ
    status: str = "completed"  # "pending", "processing", "completed", "failed"
    created_at: datetime
    updated_at: Optional[datetime] = None


class PredictionCreate(BaseModel):
    """Schema để tạo prediction mới"""
    doctor_id: str
    image_file: Any  # File upload
    patient_info: Optional[PatientInfo] = None
    notes: Optional[str] = None


class PredictionResponse(BaseModel):
    """Schema response cho client"""
    id: str
    prediction_date: datetime
    doctor_name: str
    image_url: HttpUrl
    predicted_class: BiRadsCategory
    confidence: float
    probability_distribution: List[PredictionProbability]
    risk_level: str
    recommendation: str
    processing_time: float
    status: str
    created_at: datetime


class PredictionHistory(BaseModel):
    """Schema cho lịch sử dự đoán"""
    predictions: List[PredictionResponse]
    total_count: int
    page: int
    page_size: int
    has_next: bool
    has_previous: bool


class PredictionStats(BaseModel):
    """Schema thống kê dự đoán"""
    total_predictions: int
    predictions_today: int
    accuracy_rate: float
    bi_rads_distribution: Dict[str, int]  # {"BI-RADS 0": 5, "BI-RADS 1": 10, ...}
    doctor_stats: Dict[str, int]  # {"Dr. A": 15, "Dr. B": 8, ...}
    monthly_stats: Dict[str, int]  # {"2024-01": 45, "2024-02": 52, ...}


class PredictionUpdate(BaseModel):
    """Schema để cập nhật prediction"""
    notes: Optional[str] = None
    patient_info: Optional[PatientInfo] = None
    status: Optional[str] = None