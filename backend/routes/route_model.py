from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer
from typing import Optional, List
import uuid

from database import models_collection
from utils.jwt import verify_access_token
from schemas.model import ModelInfor, ModelCreate, ModelUpdate

router = APIRouter()
security = HTTPBearer()


# Dependency để verify token và check admin role
async def verify_admin_token(token: str = Depends(security)):
    """Verify JWT token và check admin role"""
    try:
        # Decode JWT token
        payload = await verify_access_token(token.credentials)
        if not payload:
            raise HTTPException(status_code=401, detail="Token không hợp lệ hoặc đã hết hạn")
        
        # Check admin role
        user_role = payload.get("role")
        if user_role != "admin":
            raise HTTPException(status_code=403, detail="Chỉ admin mới có quyền quản lý model")
        
        return payload
        
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Lỗi xác thực: {str(e)}")

@router.post("/", response_model=ModelInfor)
async def create_model(
    model_data: ModelCreate,
    admin_user: dict = Depends(verify_admin_token)
):
    """
    Tạo model mới
    """
    try:
        print("model_data: ", model_data)
        print("admin_user: ", admin_user)
        # Check if model name already exists
        existing_model = await models_collection.find_one({"name": model_data.name})
        if existing_model:
            raise HTTPException(status_code=400, detail="Model với tên này đã tồn tại")
        
        # Generate model ID
        model_id = str(uuid.uuid4())
        
        if model_data.is_active is True:
            # Set all other models to inactive
            await models_collection.update_many(
                {"is_active": True},
                {"$set": {"is_active": False}}
            )

                    # Create model record
            model_record = ModelInfor(
                id=model_id,
                name=model_data.name,
                url=model_data.url,
                version=model_data.version,
                is_active=model_data.is_active
            )

            print("đã thêm và set model mới nhất lên")
            # set model mới nhất lên

            await models_collection.insert_one(model_record.model_dump())

        else:

            # chỉ thêm và lưu
            model_record = ModelInfor(
                id=model_id,
                name=model_data.name,
                url=model_data.url,
                version=model_data.version,
                is_active=model_data.is_active
            )
            await models_collection.insert_one(model_record.model_dump())
            print("đã thêm model")
        return model_record
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi tạo model: {str(e)}")

@router.get("/", response_model=List[ModelInfor])
async def get_models(
    page: int = 1,
    limit: int = 10,
    search: Optional[str] = None,
    is_active: Optional[bool] = None,
    admin_user: dict = Depends(verify_admin_token)
):
    """
    Lấy danh sách tất cả models với filtering và pagination
    """
    try:
        # Validate pagination
        if page < 1 or limit < 1 or limit > 100:
            raise HTTPException(status_code=400, detail="Tham số phân trang không hợp lệ")
        
        # Build filter query
        filter_query = {}
        if is_active is not None:
            filter_query['is_active'] = is_active
        if search:
            filter_query['$or'] = [
                {'name': {'$regex': search, '$options': 'i'}},
                {'version': {'$regex': search, '$options': 'i'}}
            ]
        
        # Calculate skip
        skip = (page - 1) * limit
        
        # Get models from database
        cursor = models_collection.find(filter_query).skip(skip).limit(limit).sort('name', 1)
        models = await cursor.to_list(length=limit)
        
        # Convert to response format
        model_responses = []
        for model in models:
            model_responses.append(ModelInfor(**model))
        
        return model_responses
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi lấy danh sách model: {str(e)}")


@router.get("/{model_id}", response_model=ModelInfor)
async def get_model(
    model_id: str,
    admin_user: dict = Depends(verify_admin_token)
):
    """
    Lấy thông tin chi tiết một model theo ID
    """
    try:
        # Find model by ID
        model = await models_collection.find_one({"id": model_id})
        if not model:
            raise HTTPException(status_code=404, detail="Không tìm thấy model")
        
        return ModelInfor(**model)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi lấy thông tin model: {str(e)}")


@router.put("/{model_id}", response_model=ModelInfor)
async def update_model(
    model_id: str,
    update_data: ModelUpdate,
    admin_user: dict = Depends(verify_admin_token)
):
    """
    Cập nhật thông tin model
    """
    try:
        # Check if model exists
        existing_model = await models_collection.find_one({"id": model_id})
        if not existing_model:
            raise HTTPException(status_code=404, detail="Không tìm thấy model")
        
        # Prepare update data
        update_dict = {}
        for field, value in update_data.dict(exclude_unset=True).items():
            if value is not None:
                update_dict[field] = value
        
        if not update_dict:
            raise HTTPException(status_code=400, detail="Không có dữ liệu để cập nhật")
        
        # Update model
        result = await models_collection.update_one(
            {"id": model_id},
            {"$set": update_dict}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Không có thay đổi nào được thực hiện")
        
        # Get updated model
        updated_model = await models_collection.find_one({"id": model_id})
        return ModelInfor(**updated_model)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi cập nhật model: {str(e)}")


@router.delete("/{model_id}")
async def delete_model(
    model_id: str,
    admin_user: dict = Depends(verify_admin_token)
):
    """
    Xóa model
    """
    try:
        # Check if model exists
        existing_model = await models_collection.find_one({"id": model_id})
        if not existing_model:
            raise HTTPException(status_code=404, detail="Không tìm thấy model")
        
        # Delete model from database
        result = await models_collection.delete_one({"id": model_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=500, detail="Không thể xóa model")
        
        return {
            "success": True,
            "message": "Model đã được xóa thành công",
            "deleted_model_id": model_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi xóa model: {str(e)}")


@router.patch("/{model_id}/activate")
async def activate_model(
    model_id: str,
    admin_user: dict = Depends(verify_admin_token)
):
    """
    Kích hoạt model
    """
    try:
        # Check if model exists
        existing_model = await models_collection.find_one({"id": model_id})
        if not existing_model:
            raise HTTPException(status_code=404, detail="Không tìm thấy model")
        
        # Update is_active to True
        result = await models_collection.update_one(
            {"id": model_id},
            {"$set": {"is_active": True}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Model đã được kích hoạt rồi")
        
        return {
            "success": True,
            "message": "Model đã được kích hoạt thành công",
            "model_id": model_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi kích hoạt model: {str(e)}")


@router.patch("/{model_id}/deactivate")
async def deactivate_model(
    model_id: str,
    admin_user: dict = Depends(verify_admin_token)
):
    """
    Vô hiệu hóa model
    """
    try:
        # Check if model exists
        existing_model = await models_collection.find_one({"id": model_id})
        if not existing_model:
            raise HTTPException(status_code=404, detail="Không tìm thấy model")
        
        # Update is_active to False
        result = await models_collection.update_one(
            {"id": model_id},
            {"$set": {"is_active": False}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Model đã được vô hiệu hóa rồi")
        
        return {
            "success": True,
            "message": "Model đã được vô hiệu hóa thành công",
            "model_id": model_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi vô hiệu hóa model: {str(e)}")


@router.get("/stats/summary")
async def get_model_stats(
    admin_user: dict = Depends(verify_admin_token)
):
    """
    Lấy thống kê model
    """
    try:
        # Total models
        total_models = await models_collection.count_documents({})
        
        # Active models
        active_models = await models_collection.count_documents({"is_active": True})
        
        # Inactive models
        inactive_models = await models_collection.count_documents({"is_active": False})
        
        return {
            "total_models": total_models,
            "active_models": active_models,
            "inactive_models": inactive_models,
            "active_percentage": (active_models / total_models * 100) if total_models > 0 else 0
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi lấy thống kê: {str(e)}")


@router.get("/active/list", response_model=List[ModelInfor])
async def get_active_models(
    admin_user: dict = Depends(verify_admin_token)
):
    """
    Lấy danh sách models đang active
    """
    try:
        # Get active models
        cursor = models_collection.find({"is_active": True}).sort('name', 1)
        models = await cursor.to_list(length=None)
        
        # Convert to response format
        model_responses = []
        for model in models:
            model_responses.append(ModelInfor(**model))
        
        return model_responses
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi lấy danh sách model active: {str(e)}")


# End of routes
