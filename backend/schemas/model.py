from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import IntEnum

class ModelInfor(BaseModel):
    """Schema chính để lưu thông tin model"""
    id: str  # UUID
    name: str  # Tên model
    url: str  # URL S3 của model
    version: Optional[str] = None  # Version model
    is_active: bool = False  # Model có đang active không


class ModelCreate(BaseModel):
    """Schema để tạo model mới"""
    name: str
    url: str
    version: Optional[str] = None
    is_active: bool = True


class ModelUpdate(BaseModel):
    """Schema để cập nhật model"""
    name: Optional[str] = None
    url: Optional[str] = None
    version: Optional[str] = None
    is_active: Optional[bool] = None

