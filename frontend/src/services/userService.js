//  services/userService.js
import axiosClient from "./axiosClient";

const userService = {
    // Lấy danh sách users
    getAll: () => {
        return axiosClient.get("/users");
    },

    // Cập nhật thông tin user
    update: (userEmail, updatedUser) => {
        return axiosClient.put(`/user/update/${userEmail}`, updatedUser);
    },

    // Xóa user
    delete: (userEmail) => {
        return axiosClient.delete(`/user/delete/${userEmail}`);
    },

    logout: (token) => {
        return axiosClient.post("/user/logout", token);
    },

    // Login
    login: (credentials) => {
        return axiosClient.post("/user/login", credentials);
    },

    // Register
    register: (userData) => {
        return axiosClient.post("/user/register", userData);
    },

    // Send verification code
    sendVerificationCode: (email) => {
        return axiosClient.post("/user/send-verification-code", email);
    },

    // Verify code
    verifyCode: (data) => {
        return axiosClient.post("/user/verify-code", data);
    },

    // Forgot password
    forgotPassword: (data) => {
        return axiosClient.post("/user/forgot-password", data);
    },

    // Verify reset token
    verifyResetToken: (data) => {
        return axiosClient.post("/user/check-token", data);
    },

    // Reset password
    resetPassword: (data) => {
        return axiosClient.post("/user/reset-password", data);
    },

    // Google login
    googleLogin: (data) => {
        return axiosClient.post("/user/google-login", data);
    },

    // Facebook login
    facebookLogin: (data) => {
        return axiosClient.post("/user/facebook-login", data);
    },

    // Google register
    googleRegister: (data) => {
        return axiosClient.post("/user/google-register", data);
    },

    // Facebook register
    facebookRegister: (data) => {
        return axiosClient.post("/user/facebook-register", data);
    },
    
};

export default userService;
