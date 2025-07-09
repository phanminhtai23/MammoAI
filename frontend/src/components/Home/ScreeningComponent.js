import React, { useState } from "react";

const ScreeningComponent = ({ setActiveTab }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [showResult, setShowResult] = useState(false);
    const [formData, setFormData] = useState({
        q1: "", // Bạn có thể cho con bú trong thời gian dưới 12 tháng không?
        q2: "", // Bạn có tắt tụt đạc (từ hơn 30 phút/ngày hoặc không đều đặn) không?
        q3: "", // Bạn có đang sử dụng thuốc ngừa thai thường xuyên?
        q4: "", // Bạn có đang sử dụng rượu thường xuyên (hơn 10g alcohol/tháng)?
        q5: "", // Bạn có uống rượu thường xuyên (hơn 10g alcohol/tháng)?
        q6: "", // Bạn có mỗ tuần vy dây (kết quả từ ahh ảnh/siêu âm)?
        q7: "", // Bạn có đang dùng phương pháp hormone phối hợp (estrogen + progesterone)?
        q8: "", // Bạn có chỉ số BMI (cân nặng/chiều cao bình phương) trên 30 (béo phì)?
        q9: "", // Bạn có kinh nguyệt trước 12 tuổi?
        q10: "", // Bạn có mãn kinh sau 55 tuổi?
        q11: "", // Bạn có dẹp lì 40 tuổi trở lên?
        q12: "", // Bạn có ung thư ngực ở người thân ruột thì?
        q13: "", // Bạn (hoặc người thân ruột thì) đã được phát hiện có đột biến gen liên quan với BRCA
        q14: "", // Gia đình bạn có đến 2 viền ruột thì ung thư vú hoặc buồng trứng dưới 50 tuổi?
        q15: "", // Gia đình có ≥4 người (có, đà, bà ngoại,anh) bị ung thư vú hoặc buồng trứng?
        q16: "", // Bạn từng xạ trị vùng ngực trước tuổi 30?
    });

    const questions = [
        {
            id: "q1",
            question:
                "Bạn có thời gian cho con bú trong thời gian dưới 12 tháng không?",
            type: "radio",
            options: [
                { value: "0", label: "Không", points: 0 },
                { value: "1", label: "Có", points: 1 },
            ],
        },
        {
            id: "q2",
            question:
                "Bạn có tắt tụt đạc (từ hơn 30 phút/ngày hoặc không đều đặn) không?",
            type: "radio",
            options: [
                { value: "0", label: "Không", points: 0 },
                { value: "2", label: "Có", points: 2 },
            ],
        },
        {
            id: "q3",
            question: "Bạn có đang sử dụng thuốc ngừa thai thường xuyên không?",
            type: "radio",
            options: [
                { value: "0", label: "Không", points: 0 },
                { value: "1", label: "Có", points: 1 },
            ],
        },
        {
            id: "q4",
            question: "Bạn có đang sử dụng thuốc ngừa thai thường xuyên?",
            type: "radio",
            options: [
                { value: "0", label: "Không", points: 0 },
                { value: "1", label: "Có", points: 1 },
            ],
        },
        {
            id: "q5",
            question:
                "Bạn có uống rượu thường xuyên (hơn 10g alcohol/tháng) không?",
            type: "radio",
            options: [
                { value: "0", label: "Không", points: 0 },
                { value: "1", label: "Có", points: 1 },
            ],
        },
        {
            id: "q6",
            question:
                "Bạn có mỗ tuần vy dây (kết quả từ chẩn đoán hình ảnh/siêu âm) không?",
            type: "radio",
            options: [
                { value: "0", label: "Không", points: 0 },
                { value: "1", label: "Có", points: 1 },
            ],
        },
        {
            id: "q7",
            question:
                "Bạn có đang dùng phương pháp hormone phối hợp (estrogen + progesterone) không?",
            type: "radio",
            options: [
                { value: "0", label: "Không", points: 0 },
                { value: "2", label: "Có", points: 2 },
            ],
        },
        {
            id: "q8",
            question:
                "Bạn có chỉ số BMI (cân nặng/chiều cao bình phương) trên 30 (béo phì) không?",
            type: "radio",
            options: [
                { value: "0", label: "Không", points: 0 },
                { value: "1", label: "Có", points: 1 },
            ],
        },
        {
            id: "q9",
            question: "Bạn có kinh nguyệt trước 12 tuổi không?",
            type: "radio",
            options: [
                { value: "0", label: "Không", points: 0 },
                { value: "1", label: "Có", points: 1 },
            ],
        },
        {
            id: "q10",
            question: "Bạn có mãn kinh sau 55 tuổi không?",
            type: "radio",
            options: [
                { value: "0", label: "Không", points: 0 },
                { value: "1", label: "Có", points: 1 },
            ],
        },
        {
            id: "q11",
            question:
                "Bạn có sinh con đầu lòng sau 30 tuổi hoặc chưa sinh con, hoặc sinh con nhưng không cho con bú hoặc cho con bú trong thời gian dưới 12 tháng không?",
            type: "radio",
            options: [
                { value: "0", label: "Không", points: 0 },
                { value: "1", label: "Có", points: 1 },
            ],
        },
        {
            id: "q12",
            question:
                "Bạn có tiền sử ung thư vú ở người thân ruột thì (bố, mẹ, anh chị em ruột) không?",
            type: "radio",
            options: [
                { value: "0", label: "Không", points: 0 },
                { value: "2", label: "Có", points: 2 },
            ],
        },
        {
            id: "q13",
            question:
                "Bạn (hoặc người thân ruột thì) đã được phát hiện có đột biến gen liên quan với ung thư vú (BRCA1, BRCA2, TP53, PTEN, ATM, BRIP1, PALB2, CDH1, STK11,...) không?",
            type: "radio",
            options: [
                { value: "0", label: "Không", points: 0 },
                { value: "2", label: "Có", points: 2 },
            ],
        },
        {
            id: "q14",
            question:
                "Gia đình bạn có ≥2 người thân ruột thì ung thư vú hoặc buồng trứng dưới 50 tuổi không?",
            type: "radio",
            options: [
                { value: "0", label: "Không", points: 0 },
                { value: "2", label: "Có", points: 2 },
            ],
        },
        {
            id: "q15",
            question:
                "Gia đình có ≥4 người (có, đà, bà ngoại,anh) bị ung thư vú hoặc buồng trứng không?",
            type: "radio",
            options: [
                { value: "0", label: "Không", points: 0 },
                { value: "2", label: "Có", points: 2 },
            ],
        },
        {
            id: "q16",
            question: "Bạn từng xạ trị vùng ngực trước tuổi 30 không?",
            type: "radio",
            options: [
                { value: "0", label: "Không", points: 0 },
                { value: "2", label: "Có", points: 2 },
            ],
        },
    ];

    const handleInputChange = (questionId, value) => {
        setFormData((prev) => ({
            ...prev,
            [questionId]: value,
        }));
    };

    const handleNext = () => {
        if (currentStep < questions.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const calculateRisk = () => {
        let totalPoints = 0;
        questions.forEach((question) => {
            const answer = formData[question.id];
            if (answer) {
                const selectedOption = question.options.find(
                    (opt) => opt.value === answer
                );
                if (selectedOption) {
                    totalPoints += selectedOption.points;
                }
            }
        });
        return totalPoints;
    };

    const getRiskLevel = (points) => {
        if (points <= 6)
            return {
                level: "Nguy cơ thấp",
                color: "green",
                description:
                    "Bạn có nguy cơ thấp mắc ung thư vú. Tiếp tục duy trì lối sống lành mạnh và tầm soát định kỳ.",
            };
        if (points <= 12)
            return {
                level: "Nguy cơ trung bình",
                color: "yellow",
                description:
                    "Bạn có nguy cơ trung bình. Nên theo dõi chặt chẽ và tham khảo ý kiến bác sĩ chuyên khoa.",
            };
        return {
            level: "Nguy cơ cao",
            color: "red",
            description:
                "Bạn có nguy cơ cao mắc ung thư vú. Hãy đặt lịch khám với bác sĩ chuyên khoa ngay để được tư vấn và theo dõi.",
        };
    };

    const handleSubmit = () => {
        const points = calculateRisk();
        setShowResult(true);
    };

    const currentQuestion = questions[currentStep - 1];
    const isLastStep = currentStep === questions.length;
    const isFirstStep = currentStep === 1;
    const progressPercentage = (currentStep / questions.length) * 100;

    // Modal hiển thị kết quả
    const ResultModal = () => {
        const points = calculateRisk();
        const riskInfo = getRiskLevel(points);

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div
                                className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                                    riskInfo.color === "green"
                                        ? "bg-green-100"
                                        : riskInfo.color === "yellow"
                                        ? "bg-yellow-100"
                                        : "bg-red-100"
                                }`}
                            >
                                <span className="text-3xl">
                                    {riskInfo.color === "green"
                                        ? "✅"
                                        : riskInfo.color === "yellow"
                                        ? "⚠️"
                                        : "🚨"}
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Kết Quả Tầm Soát
                            </h2>
                            <p className="text-gray-600">
                                Dựa trên câu trả lời của bạn
                            </p>
                        </div>

                        {/* Điểm số */}
                        <div className="bg-gray-50 rounded-xl p-6 mb-6">
                            <div className="text-center">
                                <div className="text-5xl font-bold mb-2 text-blue-600">
                                    {points}
                                </div>
                                <div className="text-gray-600 text-lg">
                                    Tổng điểm nguy cơ
                                </div>
                            </div>
                        </div>

                        {/* Mức độ nguy cơ */}
                        <div
                            className={`rounded-xl p-6 mb-6 ${
                                riskInfo.color === "green"
                                    ? "bg-green-50 border border-green-200"
                                    : riskInfo.color === "yellow"
                                    ? "bg-yellow-50 border border-yellow-200"
                                    : "bg-red-50 border border-red-200"
                            }`}
                        >
                            <div className="text-center">
                                <h3
                                    className={`text-2xl font-bold mb-3 ${
                                        riskInfo.color === "green"
                                            ? "text-green-800"
                                            : riskInfo.color === "yellow"
                                            ? "text-yellow-800"
                                            : "text-red-800"
                                    }`}
                                >
                                    {riskInfo.level}
                                </h3>
                                <p
                                    className={`text-lg ${
                                        riskInfo.color === "green"
                                            ? "text-green-700"
                                            : riskInfo.color === "yellow"
                                            ? "text-yellow-700"
                                            : "text-red-700"
                                    }`}
                                >
                                    {riskInfo.description}
                                </p>
                            </div>
                        </div>

                        {/* Tư vấn tầm soát */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                            <h4 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                                <svg
                                    className="w-6 h-6 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Tư Vấn Tầm Soát Ung Thư Vú
                            </h4>
                            <div className="space-y-3 text-blue-800">
                                <div className="flex items-start">
                                    <span className="text-blue-600 mr-2">
                                        •
                                    </span>
                                    <span>
                                        Tầm soát định kỳ mỗi năm cho phụ nữ từ
                                        40 tuổi trở lên
                                    </span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-blue-600 mr-2">
                                        •
                                    </span>
                                    <span>
                                        Tự khám vú hàng tháng để phát hiện sớm
                                        các bất thường
                                    </span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-blue-600 mr-2">
                                        •
                                    </span>
                                    <span>
                                        Siêu âm vú và chụp X-quang mammography
                                        theo chỉ định của bác sĩ
                                    </span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-blue-600 mr-2">
                                        •
                                    </span>
                                    <span>
                                        Duy trì lối sống lành mạnh: tập thể dục,
                                        ăn uống cân bằng
                                    </span>
                                </div>
                                {riskInfo.color === "red" && (
                                    <div className="flex items-start">
                                        <span className="text-red-600 mr-2">
                                            ⚠️
                                        </span>
                                        <span className="text-red-700 font-semibold">
                                            Khuyến cáo: Liên hệ với bác sĩ
                                            chuyên khoa Ung bướu để được tư vấn
                                            và thăm khám kịp thời
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => setShowResult(false)}
                                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition duration-300"
                            >
                                Đóng kết quả
                            </button>
                            <button
                                onClick={() => setActiveTab("home")}
                                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition duration-300"
                            >
                                Về trang chủ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            {/* Modal kết quả */}
            {showResult && <ResultModal />}

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Page Title */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                        <svg
                            className="w-8 h-8 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.948.684l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Bảng Tầm Soát Nguy Cơ Ung Thư Vú
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Bảng câu hỏi tầm soát nguy cơ ung thư vú được Bác sĩ uy
                        tín xác nhận tính đúng đắn và khoa học, giúp đánh giá sơ
                        bộ nguy cơ ung thư vú của bạn
                    </p>
                </div>

                {/* Question Card - Vinmec Style */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
                    {/* Question Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                        <div className="flex items-center">
                            <div className="bg-white bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                                <span className="text-white text-xl font-bold">
                                    {currentStep}
                                </span>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {currentQuestion.question}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Question Content */}
                    <div className="p-8">
                        <div className="space-y-4 max-w-3xl mx-auto">
                            {currentQuestion.options.map((option) => (
                                <label
                                    key={option.value}
                                    className={`group block p-6 border-2 rounded-xl cursor-pointer transition duration-300 hover:border-blue-300 hover:shadow-md ${
                                        formData[currentQuestion.id] ===
                                        option.value
                                            ? "border-blue-500 bg-blue-50 shadow-md"
                                            : "border-gray-200 bg-white hover:bg-gray-50"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name={currentQuestion.id}
                                        value={option.value}
                                        checked={
                                            formData[currentQuestion.id] ===
                                            option.value
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                currentQuestion.id,
                                                e.target.value
                                            )
                                        }
                                        className="sr-only"
                                    />
                                    <div className="flex items-center">
                                        <div
                                            className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition duration-300 ${
                                                formData[currentQuestion.id] ===
                                                option.value
                                                    ? "border-blue-500 bg-blue-500"
                                                    : "border-gray-300 group-hover:border-blue-400"
                                            }`}
                                        >
                                            {formData[currentQuestion.id] ===
                                                option.value && (
                                                <div className="w-3 h-3 bg-white rounded-full"></div>
                                            )}
                                        </div>

                                        <div className="flex-1 flex justify-between items-center">
                                            <span
                                                className={`text-lg font-medium transition duration-300 ${
                                                    formData[
                                                        currentQuestion.id
                                                    ] === option.value
                                                        ? "text-blue-900"
                                                        : "text-gray-700 group-hover:text-gray-900"
                                                }`}
                                            >
                                                {option.label}
                                            </span>
                                            <div className="ml-4">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                                        option.points === 0
                                                            ? "bg-green-100 text-green-800"
                                                            : option.points ===
                                                              1
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {option.points} điểm
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
                            <button
                                onClick={handlePrevious}
                                disabled={isFirstStep}
                                className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold transition duration-300 ${
                                    isFirstStep
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                                }`}
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                                Câu trước
                            </button>

                            {isLastStep ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!formData[currentQuestion.id]}
                                    className={`inline-flex items-center px-8 py-3 rounded-xl font-semibold transition duration-300 ${
                                        !formData[currentQuestion.id]
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    }`}
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    Xác nhận hoàn thành
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    disabled={!formData[currentQuestion.id]}
                                    className={`inline-flex items-center px-8 py-3 rounded-xl font-semibold transition duration-300 ${
                                        !formData[currentQuestion.id]
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    }`}
                                >
                                    Câu tiếp theo
                                    <svg
                                        className="w-5 h-5 ml-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Progress Steps - Dời xuống dưới */}
                <div className="mt-8 mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="text-sm text-gray-500">
                            Câu hỏi {currentStep} / {questions.length}
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="w-full max-w-md bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Medical Disclaimer - Vinmec Style */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg
                                className="w-6 h-6 text-blue-600"
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
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                Lưu ý quan trọng từ chuyên gia
                            </h3>
                            <div className="text-blue-800 space-y-2">
                                <p>
                                    • Kết quả tầm soát này chỉ mang tính chất{" "}
                                    <strong>
                                        tham khảo và sàng lọc ban đầu
                                    </strong>
                                </p>
                                <p>
                                    • Để có chẩn đoán chính xác, bạn cần{" "}
                                    <strong>
                                        thăm khám trực tiếp với bác sĩ chuyên
                                        khoa Ung bướu
                                    </strong>
                                </p>
                                <p>
                                    • Nếu có bất kỳ triệu chứng bất thường nào,
                                    hãy <strong>đặt lịch khám ngay</strong> để
                                    được tư vấn kịp thời
                                </p>
                            </div>
                            <div className="mt-4">
                                <div className="inline-flex items-center text-blue-600 font-medium">
                                    <svg
                                        className="w-4 h-4 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                    Hotline tư vấn: 1900-xxxx
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScreeningComponent;
