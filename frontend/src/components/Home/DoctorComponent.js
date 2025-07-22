import React, { useState } from "react";
import { getUserInfo } from "../../utils/auth";

export default function DoctorComponent() {
    const userInfo = getUserInfo();
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    // BI-RADS categories với mô tả
    const biRadsCategories = {
        0: {
            name: "BI-RADS 0",
            description: "Cần đánh giá thêm - Không đầy đủ thông tin",
            color: "bg-gray-100 text-gray-800",
            meaning: "Cần chụp thêm hình ảnh hoặc so sánh với ảnh cũ",
        },
        1: {
            name: "BI-RADS 1",
            description: "Âm tính - Bình thường",
            color: "bg-green-100 text-green-800",
            meaning: "Không có bất thường, tiếp tục tầm soát định kỳ",
        },
        2: {
            name: "BI-RADS 2",
            description: "Tổn thương lành tính",
            color: "bg-blue-100 text-blue-800",
            meaning: "Tổn thương lành tính rõ ràng, tiếp tục tầm soát định kỳ",
        },
        3: {
            name: "BI-RADS 3",
            description: "Có thể lành tính",
            color: "bg-yellow-100 text-yellow-800",
            meaning: "Theo dõi ngắn hạn (6 tháng), xác suất ác tính <2%",
        },
        4: {
            name: "BI-RADS 4",
            description: "Nghi ngờ ác tính",
            color: "bg-orange-100 text-orange-800",
            meaning: "Cần sinh thiết, xác suất ác tính 2-95%",
        },
        5: {
            name: "BI-RADS 5",
            description: "Rất nghi ngờ ác tính",
            color: "bg-red-100 text-red-800",
            meaning: "Cần sinh thiết khẩn cấp, xác suất ác tính >95%",
        },
    };

    // Xử lý drag & drop
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files[0]);
        }
    };

    const handleImageUpload = (file) => {
        if (file && file.type.startsWith("image/")) {
            setSelectedImage(file);

            // Tạo preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);

            // Reset prediction khi upload ảnh mới
            setPrediction(null);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleImageUpload(e.target.files[0]);
        }
    };

    // Giả lập API call dự đoán
    const handlePredict = async () => {
        if (!selectedImage) return;

        setIsLoading(true);

        // Giả lập API call (thay thế bằng API thực tế)
        setTimeout(() => {
            // Giả lập kết quả dự đoán
            const mockPrediction = {
                predictions: [
                    { class: 0, probability: 0.05 },
                    { class: 1, probability: 0.15 },
                    { class: 2, probability: 0.25 },
                    { class: 3, probability: 0.3 },
                    { class: 4, probability: 0.2 },
                    { class: 5, probability: 0.05 },
                ],
                predicted_class: 3,
                confidence: 0.3,
                processing_time: "1.2s",
            };

            setPrediction(mockPrediction);
            setIsLoading(false);
        }, 2000);
    };

    const resetAll = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setPrediction(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <svg
                            className="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Chào mừng, Bác sĩ {userInfo?.name}
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Hệ thống Dự đoán AI - BI-RADS
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Upload ảnh X-quang vú để nhận dự đoán BI-RADS với độ
                        chính xác cao từ hệ thống AI
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Upload & Image */}
                    <div className="space-y-6">
                        {/* Upload Area */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <svg
                                    className="w-5 h-5 mr-2 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                                Upload ảnh X-quang
                            </h2>

                            <div
                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                                    dragActive
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                {!imagePreview ? (
                                    <>
                                        <svg
                                            className="w-12 h-12 text-gray-400 mx-auto mb-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <p className="text-gray-600 mb-2">
                                            Kéo thả ảnh vào đây hoặc
                                        </p>
                                        <label className="cursor-pointer">
                                            <span className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                                                Chọn file
                                            </span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileSelect}
                                            />
                                        </label>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Hỗ trợ: JPG, PNG, DICOM (tối đa
                                            10MB)
                                        </p>
                                    </>
                                ) : (
                                    <div className="space-y-4">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-h-64 mx-auto rounded-lg shadow-md"
                                        />
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={resetAll}
                                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
                                            >
                                                Đổi ảnh khác
                                            </button>
                                            <button
                                                onClick={handlePredict}
                                                disabled={isLoading}
                                                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <svg
                                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                            ></circle>
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                            ></path>
                                                        </svg>
                                                        Đang dự đoán...
                                                    </>
                                                ) : (
                                                    "Bắt đầu dự đoán"
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Image Display
                        {imagePreview && (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Ảnh X-quang
                                </h3>
                                <div className="border rounded-lg overflow-hidden">
                                    <img
                                        src={imagePreview}
                                        alt="X-ray"
                                        className="w-full h-auto"
                                    />
                                </div>
                                {selectedImage && (
                                    <div className="mt-4 text-sm text-gray-600">
                                        <p>
                                            <strong>Tên file:</strong>{" "}
                                            {selectedImage.name}
                                        </p>
                                        <p>
                                            <strong>Kích thước:</strong>{" "}
                                            {(
                                                selectedImage.size /
                                                1024 /
                                                1024
                                            ).toFixed(2)}{" "}
                                            MB
                                        </p>
                                    </div>
                                )}
                            </div>
                        )} */}
                    </div>

                    {/* Right Column - Results */}
                    <div className="space-y-6">
                        {/* Prediction Results */}
                        {prediction && (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <svg
                                        className="w-5 h-5 mr-2 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                    Kết quả dự đoán AI
                                </h3>

                                {/* Main Prediction */}
                                <div
                                    className={`p-4 rounded-lg mb-6 ${
                                        biRadsCategories[
                                            prediction.predicted_class
                                        ].color
                                    }`}
                                >
                                    <div className="text-center">
                                        <h4 className="text-2xl font-bold mb-2">
                                            {
                                                biRadsCategories[
                                                    prediction.predicted_class
                                                ].name
                                            }
                                        </h4>
                                        <p className="text-lg font-semibold mb-2">
                                            {
                                                biRadsCategories[
                                                    prediction.predicted_class
                                                ].description
                                            }
                                        </p>
                                        <p className="text-sm">
                                            {
                                                biRadsCategories[
                                                    prediction.predicted_class
                                                ].meaning
                                            }
                                        </p>
                                        <div className="mt-3">
                                            <span className="text-sm font-medium">
                                                Độ tin cậy:{" "}
                                            </span>
                                            <span className="text-lg font-bold">
                                                {(
                                                    prediction.confidence * 100
                                                ).toFixed(1)}
                                                %
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Probability Distribution */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900">
                                        Phân bố xác suất các lớp BI-RADS:
                                    </h4>
                                    {prediction.predictions.map((pred) => (
                                        <div
                                            key={pred.class}
                                            className="space-y-2"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-700">
                                                    {
                                                        biRadsCategories[
                                                            pred.class
                                                        ].name
                                                    }
                                                </span>
                                                <span className="text-sm font-bold text-gray-900">
                                                    {(
                                                        pred.probability * 100
                                                    ).toFixed(1)}
                                                    %
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-500 ${
                                                        pred.class ===
                                                        prediction.predicted_class
                                                            ? "bg-blue-600"
                                                            : "bg-gray-400"
                                                    }`}
                                                    style={{
                                                        width: `${
                                                            pred.probability *
                                                            100
                                                        }%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Processing Info */}
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>
                                            Thời gian xử lý:{" "}
                                            {prediction.processing_time}
                                        </span>
                                        <span>Mô hình: MammoAI v2.1</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* BI-RADS Guide */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <svg
                                    className="w-5 h-5 mr-2 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Hướng dẫn BI-RADS
                            </h3>
                            <div className="space-y-3">
                                {Object.entries(biRadsCategories).map(
                                    ([key, category]) => (
                                        <div
                                            key={key}
                                            className={`p-3 rounded-lg ${category.color}`}
                                        >
                                            <div className="font-semibold">
                                                {category.name}:{" "}
                                                {category.description}
                                            </div>
                                            <div className="text-sm mt-1">
                                                {category.meaning}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Thống kê hôm nay
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        24
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Dự đoán
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        97.8%
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Độ chính xác
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
