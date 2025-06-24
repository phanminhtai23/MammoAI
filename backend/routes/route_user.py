from fastapi import APIRouter, HTTPException, Depends
from database import users_collection, users_session_collection
from schemas.user import UserRegister, LoginRequest, UserUpdate, UserResponse, SendVerificationCode, VerifyCode, VerifyResetToken, ResetPassword
from utils.security import hash_password, verify_password, get_current_user, check_admin_role
from utils.jwt import create_access_token, verify_access_token
from fastapi.encoders import jsonable_encoder
import uuid
from datetime import datetime, timezone, timedelta  # Thêm timedelta vào import
from database import verification_codes_collection
from utils.send_mail import send_verification_email, generate_verification_code, send_forgot_password_email
from config import VERIFICATION_CODE_EXPIRE_MINUTES, FRONTEND_URL

router = APIRouter()

@router.post("/register", response_model=dict)
async def register(user: UserRegister):
    """
    Đăng ký tài khoản mới
    - **name**: Họ và tên
    - **email**: Email (phải unique)
    - **password**: Mật khẩu (sẽ được hash)
    """
    # Kiểm tra email đã tồn tại chưa
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=400, 
            detail="Email đã được đăng ký"
        )
    
    # Tạo UUID cho user
    user_id = str(uuid.uuid4())
    
    # Tạo dữ liệu user theo schema mới
    user_data = {
        "id": user_id,
        "email": user.email,
        "password_hash": hash_password(user.password),  # Hash password
        "name": user.name,
        "auth_provider": "local",  # Mặc định là local
        "provider_id": None,
        "isRevoked": False,
        "confirmed": False,  # Mặc định đã xác nhận
        "role": "user",  # Mặc định là user
        "created_at": datetime.now(timezone.utc)
    }
    
    try:
        # Lưu vào database
        result = await users_collection.insert_one(user_data)
        # Trả về thông tin user đã tạo
        return {
            "status_code": 201,
            "message": "Đăng ký tài khoản thành công",
            "data": {
                "user_id": user_id,
                "email": user.email,
                "name": user.name,
                "role": "user",
                "created_at": user_data["created_at"]
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi khi tạo tài khoản: {str(e)}"
        )

@router.post("/send-verification-code")
async def send_verification_code(data: SendVerificationCode):
    """
    Gửi mã xác thực đến email
    """

    # Xóa mã xác thực cũ
    await verification_codes_collection.delete_many({"email": data.email})

    # Kiểm tra .email có tồn tại không
    existing_user = await users_collection.find_one({"email": data.email})
    if not existing_user:
        raise HTTPException(
            status_code=404,
            detail="Email không tồn tại"
        )
    
    # Tạo mã xác thực
    verification_code = generate_verification_code()


    # Lưu mã xác thực vào database
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=VERIFICATION_CODE_EXPIRE_MINUTES)
    print("expires_at luu vao databaste:", expires_at)
    await verification_codes_collection.insert_one({
        "email": data.email,
        "code": verification_code,
        "expires_at": expires_at,
    })


    #Gửi mail
    expires_at_vn = expires_at.astimezone(timezone(timedelta(hours=7)))
    send_verification_email(data.email, verification_code, expires_at_vn)

    return {"status": 200, "message": "Mã xác thực đã được gửi đến email"}


@router.post("/verify-code")
async def verify_code(data: VerifyCode):
    """
    Xác thực mã xác thực
    """
    # Kiểm tra mã xác thực có tồn tại không
    verification_code = await verification_codes_collection.find_one({"email": data.email, "code": data.code})

    if not verification_code:
        raise HTTPException(
            status_code=404,
            detail="Email chưa đăng ký hoặc đã xác thực tài khoản"
        )
    
    expires_at = verification_code["expires_at"]
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
        
    now = datetime.now(timezone.utc)
    print("now:", now)
    print("expires_at:", expires_at)
    # Kiểm tra mã xác thực có hết hạn không
    if expires_at < now:
        raise HTTPException(
            status_code=400,
            detail="Mã xác thực đã hết hạn"
        )

    # so sánh mã xác thực
    if verification_code["code"] != data.code:
        raise HTTPException(
            status_code=400,
            detail="Mã xác thực không hợp lệ"
        )

    # Mã xác thực hợp lệ, xóa mã xác thực cũ
    await verification_codes_collection.delete_many({"email": data.email})

    # Cập nhật trạng thái xác thực tài khoản
    await users_collection.update_one({"email": data.email}, {"$set": {"confirmed": True}})
    
    return {"status": 200, "message": "Mã xác thực hợp lệ"}

@router.post("/login")
async def login(user: LoginRequest):
    """
    Đăng nhập tài khoản
    """
    # Tìm user bằng email
    db_user = await users_collection.find_one({"email": user.email})
    
    # Kiểm tra tài khoản có tồn tại không
    if not db_user:
        raise HTTPException(
            status_code=404, 
            detail="Email chưa đăng ký tài khoản"
        )
    
    # Kiểm tra tài khoản có bị revoke không
    if db_user.get("isRevoked", False):
        raise HTTPException(
            status_code=403,
            detail="Tài khoản đã bị khóa"
        )
    
    # Kiểm tra password (sử dụng password_hash thay vì password)
    if not verify_password(user.password, db_user["password_hash"]):
        raise HTTPException(
            status_code=401, 
            detail="Sai tài khoản hoặc mật khẩu"
        )


    # Kiểm tra tài khoản có xác thực không
    if not db_user.get("confirmed", False):
        raise HTTPException(
            status_code=403,
            detail="Tài khoản chưa xác thực"
        )

    # Tạo access token
    access_token, created_at, expires_at = create_access_token(
        data={
            "sub": db_user["email"],
            "user_id": db_user["id"],
            "role": db_user["role"]
        }
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "message": "Đăng nhập thành công",
        "user": {
            "id": db_user["id"],
            "email": db_user["email"],
            "name": db_user["name"],
            "role": db_user["role"],
            "confirmed": db_user["confirmed"]
        }
    }


@router.post("/forgot-password")
async def forgot_password(data: SendVerificationCode):
    """
    Quên mật khẩu
    """
    # Kiểm tra email có tồn tại không
    db_user = await users_collection.find_one({"email": data.email})

    if not db_user:
        raise HTTPException(status_code=404, detail="Email chưa đăng ký tài khoản")
    
    token, created_at, expires_at = create_access_token(
        data={
            "sub": db_user["email"],
            "user_id": db_user["id"],
        }
    )

    reset_password_url = f"{FRONTEND_URL}/reset-password?token={token}"
    print("reset_password_url:", reset_password_url)
    send_forgot_password_email(data.email, token, expires_at, reset_password_url)

    return {"status": 200, "message": "Email đã được gửi đến"}

@router.get("/")
async def get_all_users(user: dict = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if not check_admin_role(user):
        raise HTTPException(status_code=403, detail="You do not have permission to access this resource")

    users = await users_collection.find({"role": "user"}).to_list()
    valid_users = []
    for user in users:
        try:
            valid_users.append({
                "id": user["id"],
                "email": user["email"],
                "name": user["name"],  # ✅ Đúng
                "role": user["role"]
            })
        except KeyError as e:
            print(f"Missing key: {e}, skipping invalid user: {user}")

    return {"message": "Got users successfully", "users": valid_users}



# @router.post("/logout")
# async def logout(token: str, user: dict = Depends(get_current_user)):
#     # Kiểm tra xem người dùng đã đăng nhập hay chưa
#     if not user:
#         raise HTTPException(status_code=401, detail="Unauthorized")

#     token_data = token.model_dump()
#     token_data["token"] = str(token.token)
#     # # Đánh dấu token hiện tại là "đã thu hồi" (revoked)
#     # result = await tokens_collection.update_one(
#     #     {"token": token_data["token"], "is_revoked": False},
#     #     {"$set": {"is_revoked": True}}
#     # )

#     # # Kiểm tra xem token có tồn tại hay không
#     # if result.matched_count == 0:
#     #     print("Token không tồn tại hoặc đã được thu hồi")
#     #     raise HTTPException(
#     #         status_code=404, detail="Token không tồn tại hoặc đã được thu hồi")

#     return {"status": 200, "message": "Đăng xuất thành công"}


@router.get("/verify-token")
async def verify_token(user: dict = Depends(get_current_user)):
    # Kiểm tra xem người dùng đã đăng nhập hay chưa
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return {"status": 200, "message": "Token hợp lệ"}

@router.post("/check-token")
async def check_token(token: VerifyResetToken):
    """
    Kiểm tra token còn hạn không và trả về payload
    """
    payload = await verify_access_token(token.token)
    # print("voddaayyyyyyyyyy", payload)
    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Token không hợp lệ hoặc đã hết hạn"
        )
    # Nếu decode thành công, token còn hạn
    return {
        "status": 200,
        "message": "Token còn hạn",
        "payload": payload
    }
        
@router.post("/reset-password")
async def reset_password(data: ResetPassword):
    """
    Đặt lại mật khẩu
    """
    payload = await verify_access_token(data.token)
    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Token không hợp lệ hoặc đã hết hạn"
        )
    
    try:
    # Cập nhật lại mật khẩu cho user
        await users_collection.update_one({"id": payload["user_id"]}, {"$set": {"password_hash": hash_password(data.new_password)}})
        return {"status": 200, "message": "Mật khẩu đã được đặt lại thành công"}
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail="Lỗi khi đặt lại mật khẩu"
        )


@router.delete("/delete/{userEmail}")
async def delete_user(userEmail: str, user: dict = Depends(get_current_user)):
    # Kiểm tra xem người dùng đã đăng nhập hay chưa
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # Xóa user từ database
    result = await users_collection.delete_one({"email": userEmail})
    # Kiểm tra xem user có tồn tại hay không
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    # Xóa token liên quan đến user
    # await tokens_collection.delete_many({"username": userEmail})
    
    return {"status": 200, "message": "User deleted successfully"}


@router.put("/update/{userEmail}")
async def update_user(userEmail: str, updated_data: dict, user: dict = Depends(get_current_user)):
    # Kiểm tra xem người dùng đã đăng nhập hay chưa
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    # Cập nhật thông tin user trong database
    
    print("voday neee")
    result = await users_collection.update_one(
        {"email": userEmail},
        {"$set": {"full_name": updated_data.get("full_name"), "role": updated_data.get("role")}}
    )
    # Kiểm tra xem user có tồn tại hay không
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": 200, "message": "User updated successfully"}

