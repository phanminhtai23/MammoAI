from fastapi import APIRouter, HTTPException, Depends, Query
from database import users_collection, users_session_collection
from schemas.user import UserResponse, UserUpdate
from utils.security import get_current_user, check_admin_role
from fastapi.encoders import jsonable_encoder
from typing import Optional, List
from datetime import datetime, timedelta
import math

router = APIRouter()

# ===== ENDPOINT LẤY DANH SÁCH USER VỚI SEARCH VÀ PAGINATION =====
@router.get("/users", response_model=dict)
async def get_users(
    page: int = Query(1, ge=1, description="Số trang"),
    page_size: int = Query(8, ge=1, le=50, description="Số user mỗi trang"),
    search: Optional[str] = Query(None, description="Tìm kiếm theo tên hoặc ID"),
    role: Optional[str] = Query(None, description="Lọc theo role"),
    auth_provider: Optional[str] = Query(None, description="Lọc theo provider"),
    is_revoked: Optional[bool] = Query(None, description="Lọc theo trạng thái"),
    current_user: dict = Depends(get_current_user)
):
    """
    Lấy danh sách user với search và pagination (Admin only)
    """
    # Kiểm tra quyền admin
    check_admin_role(current_user)
    
    # Tạo filter query
    filter_query = {}
    
    # Search theo tên hoặc ID
    if search:
        filter_query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"id": {"$regex": search, "$options": "i"}}
        ]
    
    # Lọc theo role
    if role:
        filter_query["role"] = role
        
    # Lọc theo auth_provider
    if auth_provider:
        filter_query["auth_provider"] = auth_provider
        
    # Lọc theo trạng thái revoked
    if is_revoked is not None:
        filter_query["isRevoked"] = is_revoked
    
    try:
        # Đếm tổng số user
        total_users = await users_collection.count_documents(filter_query)
        
        # Tính toán pagination
        skip = (page - 1) * page_size
        total_pages = math.ceil(total_users / page_size)
        
        # Lấy danh sách user
        cursor = users_collection.find(
            filter_query,
            {"password_hash": 0}  # Không trả về password_hash
        ).skip(skip).limit(page_size).sort("created_at", -1)
        
        users = await cursor.to_list(length=page_size)
        
        # Format response
        users_response = []
        for user in users:
            user_data = {
                "id": user["id"],
                "name": user["name"],
                "email": user.get("email", ""),
                "auth_provider": user.get("auth_provider", "local"),
                "role": user.get("role", "user"),
                "isRevoked": user.get("isRevoked", False),
                "confirmed": user.get("confirmed", False),
                "created_at": user["created_at"],
                "imgUrl": user.get("imgUrl", "")
            }
            users_response.append(user_data)
        
        return {
            "status_code": 200,
            "message": "Lấy danh sách user thành công",
            "data": {
                "users": users_response,
                "pagination": {
                    "current_page": page,
                    "page_size": page_size,
                    "total_users": total_users,
                    "total_pages": total_pages,
                    "has_next": page < total_pages,
                    "has_prev": page > 1
                }
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi khi lấy danh sách user: {str(e)}"
        )

# ===== ENDPOINT XEM CHI TIẾT USER =====
@router.get("/users/{user_id}", response_model=dict)
async def get_user_detail(
    user_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Xem chi tiết một user (Admin only)
    """
    # Kiểm tra quyền admin
    check_admin_role(current_user)
    
    try:
        # Tìm user theo ID
        user = await users_collection.find_one(
            {"id": user_id},
            {"password_hash": 0}  # Không trả về password
        )
        
        if not user:
            raise HTTPException(
                status_code=404,
                detail="Không tìm thấy user"
            )
        
        # Format response
        user_data = {
            "id": user["id"],
            "name": user["name"],
            "email": user.get("email", ""),
            "auth_provider": user.get("auth_provider", "local"),
            "provider_id": user.get("provider_id"),
            "role": user.get("role", "user"),
            "isRevoked": user.get("isRevoked", False),
            "confirmed": user.get("confirmed", False),
            "created_at": user["created_at"],
            "imgUrl": user.get("imgUrl", "")
        }
        
        return {
            "status_code": 200,
            "message": "Lấy thông tin user thành công",
            "data": user_data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi khi lấy thông tin user: {str(e)}"
        )

# ===== ENDPOINT CẬP NHẬT USER =====
@router.put("/users/{user_id}", response_model=dict)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Cập nhật thông tin user (Admin only)
    """
    # Kiểm tra quyền admin
    check_admin_role(current_user)
    
    try:
        # Kiểm tra user có tồn tại không
        existing_user = await users_collection.find_one({"id": user_id})
        if not existing_user:
            raise HTTPException(
                status_code=404,
                detail="Không tìm thấy user"
            )
        
        # Tạo update data
        update_data = {}
        if user_update.name is not None:
            update_data["name"] = user_update.name
        if user_update.role is not None:
            update_data["role"] = user_update.role
        if user_update.isRevoked is not None:
            update_data["isRevoked"] = user_update.isRevoked
        if user_update.confirmed is not None:
            update_data["confirmed"] = user_update.confirmed
            
        # Thêm timestamp cập nhật
        update_data["updated_at"] = datetime.now()
        
        if not update_data:
            raise HTTPException(
                status_code=400,
                detail="Không có dữ liệu để cập nhật"
            )
        
        # Cập nhật trong database
        result = await users_collection.update_one(
            {"id": user_id},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=400,
                detail="Không có thay đổi nào được thực hiện"
            )
        
        # Lấy user đã cập nhật
        updated_user = await users_collection.find_one(
            {"id": user_id},
            {"password_hash": 0}
        )
        
        return {
            "status_code": 200,
            "message": "Cập nhật user thành công",
            "data": {
                "id": updated_user["id"],
                "name": updated_user["name"],
                "role": updated_user["role"],
                "isRevoked": updated_user["isRevoked"],
                "confirmed": updated_user["confirmed"]
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi khi cập nhật user: {str(e)}"
        )

# ===== ENDPOINT XÓA USER =====
@router.delete("/users/{user_id}", response_model=dict)
async def delete_user(
    user_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Xóa user (Admin only) - Soft delete bằng cách set isRevoked = True
    """
    # Kiểm tra quyền admin
    if not check_admin_role(current_user):
        raise HTTPException(
            status_code=400,
            detail="Bạn không có quyền xóa user"
            )
    
    try:
        # Kiểm tra user có tồn tại không
        existing_user = await users_collection.find_one({"id": user_id})
        if not existing_user:
            raise HTTPException(
                status_code=404,
                detail="Không tìm thấy user"
            )
        
        # Không cho phép xóa chính mình
        if user_id == current_user["user_id"]:
            raise HTTPException(
                status_code=400,
                detail="Không thể xóa tài khoản của chính mình"
            )
        
        # Soft delete - set isRevoked = True
        result = await users_collection.update_one(
            {"id": user_id},
            {"$set": {
                "isRevoked": True,
                "deleted_at": datetime.now()
            }}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=400,
                detail="Không thể xóa user"
            )
        
        return {
            "status_code": 200,
            "message": "Xóa user thành công",
            "data": {"user_id": user_id}
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi khi xóa user: {str(e)}"
        )

# ===== ENDPOINT THỐNG KÊ USER Biểu đồ tròn =====
@router.get("/users/stats/summary", response_model=dict)
async def get_users_stats(
    current_user: dict = Depends(get_current_user)
):
    """
    Lấy thống kê tổng quan về user (Admin only)
    """
    # Kiểm tra quyền admin
    if not check_admin_role(current_user):
        raise HTTPException(
            status_code=400,
            detail="Bạn không có quyền xem thống kê"
        )
    
    try:
        # Thống kê tổng số user
        total_users = await users_collection.count_documents({})
        active_users = await users_collection.count_documents({"isRevoked": False})
        revoked_users = await users_collection.count_documents({"isRevoked": True})
        
        # Thống kê theo role
        admin_count = await users_collection.count_documents({"role": "admin"})
        user_count = await users_collection.count_documents({"role": "user"})
        
        # Thống kê theo auth provider
        local_count = await users_collection.count_documents({"auth_provider": "local"})
        google_count = await users_collection.count_documents({"auth_provider": "google"})
        facebook_count = await users_collection.count_documents({"auth_provider": "facebook"})
        
        # User mới trong 30 ngày qua
        from datetime import datetime, timedelta
        thirty_days_ago = datetime.now() - timedelta(days=30)
        new_users_30d = await users_collection.count_documents({
            "created_at": {"$gte": thirty_days_ago}
        })
        
        return {
            "status_code": 200,
            "message": "Lấy thống kê thành công",
            "data": {
                "total_users": total_users,
                "active_users": active_users,
                "revoked_users": revoked_users,
                "new_users_30d": new_users_30d,
                "role_stats": {
                    "admin": admin_count,
                    "user": user_count
                },
                "provider_stats": {
                    "local": local_count,
                    "google": google_count,
                    "facebook": facebook_count
                }
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi khi lấy thống kê: {str(e)}"
        )

@router.get("/users/traffic/overview", response_model=dict)
async def get_traffic_overview(
    current_user: dict = Depends(get_current_user)
):
    """
    Lấy thống kê tổng quan về traffic user (Admin only)
    """
    # Kiểm tra quyền admin
    if not check_admin_role(current_user):
        raise HTTPException(
            status_code=403,
            detail="Bạn không có quyền xem thống kê traffic"
        )
    
    try:
        print("🔍 Bắt đầu lấy traffic overview...")
        
        # Thống kê cơ bản
        total_users = await users_collection.count_documents({})
        online_users = await users_session_collection.count_documents({"is_active": True})
        print(f"📊 Total users: {total_users}, Online: {online_users}")
        
        # User mới tháng này với múi giờ Việt Nam
        from datetime import timezone, timedelta
        vietnam_tz = timezone(timedelta(hours=7))
        now = datetime.now(vietnam_tz)
        start_of_month = datetime(now.year, now.month, 1)
        
        print(f"🗓️ Tìm user mới từ {start_of_month} (tháng {now.month}/{now.year})")
        
        # Pipeline flexible cho new users tháng này
        pipeline_new_users = [
            {
                "$addFields": {
                    "created_datetime": {
                        "$cond": {
                            "if": {"$eq": [{"$type": "$created_at"}, "string"]},
                            "then": {"$dateFromString": {"dateString": "$created_at"}},
                            "else": "$created_at"
                        }
                    }
                }
            },
            {
                "$match": {
                    "created_datetime": {"$gte": start_of_month}
                }
            },
            {
                "$count": "new_users_count"
            }
        ]
        
        new_users_result = await users_collection.aggregate(pipeline_new_users).to_list(length=None)
        new_users_this_month = new_users_result[0]["new_users_count"] if new_users_result else 0
        
        # Tính phiên trung bình thực tế
        total_sessions = await users_session_collection.count_documents({})
        if total_users > 0:
            average_sessions = round(total_sessions / total_users, 1)
        else:
            average_sessions = 0.0
            
        print(f"📈 New users tháng này: {new_users_this_month}")
        print(f"📊 Total sessions: {total_sessions}, Average: {average_sessions}")
        
        result_data = {
            "totalUsers": total_users,
            "onlineUsers": online_users,
            "newUsersThisMonth": new_users_this_month,
            "averageSessions": average_sessions
        }
        
        print(f"✅ Trả về data: {result_data}")
        
        return {
            "status_code": 200,
            "message": "Lấy thống kê traffic thành công",
            "data": result_data
        }
        
    except Exception as e:
        print(f"❌ Lỗi trong get_traffic_overview: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi khi lấy thống kê traffic: {str(e)}"
        )

@router.get("/users/traffic/new-users-by-month", response_model=dict)
async def get_new_users_by_month(
    months: int = Query(6, ge=1, le=12, description="Số tháng gần đây"),
    current_user: dict = Depends(get_current_user)
):
    """
    Lấy thống kê user mới theo tháng (Admin only)
    """
    print("months: ", months)
    # Kiểm tra quyền admin
    if not check_admin_role(current_user):
        raise HTTPException(
            status_code=403,
            detail="Bạn không có quyền xem thống kê"
        )
    
    try:
        # Tính toán với múi giờ Việt Nam (+7)
        from datetime import timezone, timedelta
        vietnam_tz = timezone(timedelta(hours=7))
        now = datetime.now(vietnam_tz)
        
        # Tính start_date: lùi về {months} tháng trước
        if now.month > months:
            start_month = now.month - months + 1
            start_year = now.year
        else:
            start_month = 12 - (months - now.month - 1)
            start_year = now.year - 1
            
        start_date = datetime(start_year, start_month, 1)
        print(f"🔍 Tìm users từ {start_date} với {months} tháng gần đây")
        
        # Pipeline flexible - handle cả string và date object
        pipeline = [
            {
                "$addFields": {
                    "created_datetime": {
                        "$cond": {
                            "if": {"$eq": [{"$type": "$created_at"}, "string"]},
                            "then": {"$dateFromString": {"dateString": "$created_at"}},
                            "else": "$created_at"
                        }
                    }
                }
            },
            {
                "$match": {
                    "created_datetime": {"$gte": start_date}
                }
            },
            {
                "$group": {
                    "_id": {
                        "year": {"$year": "$created_datetime"},
                        "month": {"$month": "$created_datetime"}
                    },
                    "users": {"$sum": 1}
                }
            },
            {
                "$sort": {"_id.year": 1, "_id.month": 1}
            }
        ]
        
        result = await users_collection.aggregate(pipeline).to_list(length=None)
        print(f"📊 Kết quả aggregation: {len(result)} tháng có data")
        
        # Format dữ liệu
        formatted_data = []
        for item in result:
            month_str = f"{item['_id']['month']:02d}/{item['_id']['year']}"
            month_label = f"Tháng {item['_id']['month']}"
            formatted_data.append({
                "month": month_str,
                "label": month_label,
                "users": item["users"]
            })
        
        print(f"✅ Trả về {len(formatted_data)} tháng: {[x['month'] for x in formatted_data]}")
        
        return {
            "status_code": 200,
            "message": "Lấy thống kê user mới theo tháng thành công",
            "data": formatted_data
        }
        
    except Exception as e:
        print(f"❌ Lỗi trong get_new_users_by_month: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi khi lấy thống kê user theo tháng: {str(e)}"
        )

@router.get("/users/traffic/auth-provider-distribution", response_model=dict)
async def get_auth_provider_distribution(
    current_user: dict = Depends(get_current_user)
):
    """
    Lấy phân bố user theo auth provider (Admin only)
    """
    # Kiểm tra quyền admin
    if not check_admin_role(current_user):
        raise HTTPException(
            status_code=403,
            detail="Bạn không có quyền xem thống kê"
        )
    
    try:
        # Thống kê theo auth provider
        local_count = await users_collection.count_documents({"auth_provider": "local"})
        google_count = await users_collection.count_documents({"auth_provider": "google"})
        facebook_count = await users_collection.count_documents({"auth_provider": "facebook"})
        
        # Format dữ liệu cho pie chart
        data = [
            {"name": "Local", "value": local_count, "color": "#6B7280"},
            {"name": "Google", "value": google_count, "color": "#3B82F6"},
            {"name": "Facebook", "value": facebook_count, "color": "#60A5FA"}
        ]
        
        return {
            "status_code": 200,
            "message": "Lấy phân bố auth provider thành công",
            "data": data
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi khi lấy phân bố auth provider: {str(e)}"
        )

@router.get("/users/traffic/logins-by-period", response_model=dict)
async def get_logins_by_period(
    period: str = Query("day", description="Kỳ thống kê: luôn là day"),
    days: int = Query(14, ge=7, le=14, description="Số ngày gần đây (7-14 ngày)"),
    current_user: dict = Depends(get_current_user)
):
    """
    Lấy thống kê lượt đăng nhập 7-14 ngày gần đây (Admin only)
    """
    # Kiểm tra quyền admin
    if not check_admin_role(current_user):
        raise HTTPException(
            status_code=403,
            detail="Bạn không có quyền xem thống kê"
        )
    
    try:
        # Tính ngày bắt đầu và kết thúc với múi giờ Việt Nam (+7)
        from datetime import timezone, timedelta
        vietnam_tz = timezone(timedelta(hours=7))
        end_date = datetime.now(vietnam_tz)
        start_date = end_date - timedelta(days=days)
        
        print(f"🔍 Tìm sessions từ {start_date} đến {end_date} (trong {days} ngày gần đây)")
        
        # Pipeline flexible - handle cả string và date object cho login_at
        pipeline = [
            {
                "$addFields": {
                    "login_datetime": {
                        "$cond": {
                            "if": {"$eq": [{"$type": "$login_at"}, "string"]},
                            "then": {"$dateFromString": {"dateString": "$login_at"}},
                            "else": "$login_at"
                        }
                    }
                }
            },
            {
                "$match": {
                    "login_datetime": {"$gte": start_date, "$lte": end_date}
                }
            },
            {
                "$group": {
                    "_id": {
                        "year": {"$year": "$login_datetime"},
                        "month": {"$month": "$login_datetime"},
                        "day": {"$dayOfMonth": "$login_datetime"}
                    },
                    "logins": {"$sum": 1}
                }
            },
            {
                "$sort": {"_id.year": 1, "_id.month": 1, "_id.day": 1}
            }
        ]
        
        result = await users_session_collection.aggregate(pipeline).to_list(length=None)
        print(f"📊 Kết quả aggregation: {len(result)} records")
        
        # Format dữ liệu với tên tháng đúng
        month_names = {
            1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 
            5: "May", 6: "Jun", 7: "Jul", 8: "Aug",
            9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
        }
        
        formatted_data = []
        for item in result:
            day = item['_id']['day']
            month = item['_id']['month']
            year = item['_id']['year']
            
            date_str = f"{day:02d}/{month:02d}"
            month_name = month_names.get(month, "Unknown")
            date_label = f"{day} {month_name}"
            
            formatted_data.append({
                "date": date_str,
                "label": date_label,
                "logins": item["logins"]
            })
        
        print(f"✅ Trả về {len(formatted_data)} data points")
        
        return {
            "status_code": 200,
            "message": "Lấy thống kê đăng nhập thành công",
            "data": formatted_data
        }
        
    except Exception as e:
        print(f"❌ Lỗi trong get_logins_by_period: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi khi lấy thống kê đăng nhập: {str(e)}"
        )