import React from "react";
import { Link } from "react-router-dom";

const HomeNavigateComponent = ({ activeTab, setActiveTab }) => {
    return (
        <header className="bg-white/95 shadow-lg backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-5">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 mr-4 shadow-lg transform hover:scale-105 transition duration-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-7 w-7 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                        </div>
                        <div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                                MammoAI
                            </span>
                            <div className="text-xs text-gray-500 font-medium">
                                Tầm soát ung thư vú
                            </div>
                        </div>
                    </div>

                    {/* Menu ngang - Tất cả items thẳng hàng */}
                    <nav className="hidden md:flex items-center space-x-2">
                        <button
                            onClick={() => setActiveTab("home")}
                            className={`relative font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 ${
                                activeTab === "home"
                                    ? "text-blue-700 bg-blue-50 shadow-sm"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                            <span className="flex items-center">
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                                Trang chủ
                            </span>
                            {activeTab === "home" && (
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-blue-500 rounded-full"></div>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab("screening")}
                            className={`relative font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 ${
                                activeTab === "screening"
                                    ? "text-blue-700 bg-blue-50 shadow-sm"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                            <span className="flex items-center">
                                <svg
                                    className="w-4 h-4 mr-2"
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
                                Tầm soát ung thư
                            </span>
                            {activeTab === "screening" && (
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-blue-500 rounded-full"></div>
                            )}
                        </button>

                        <div className="h-6 w-px bg-gray-300 mx-2"></div>

                        <Link
                            to="/login"
                            className="font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 flex items-center group"
                        >
                            <svg
                                className="w-4 h-4 mr-2 group-hover:text-blue-500 transition duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                />
                            </svg>
                            Đăng nhập
                            <span className="ml-1 text-xs text-gray-400 group-hover:text-blue-400 transition duration-300">
                                (Bác sĩ)
                            </span>
                        </Link>

                        <Link
                            to="/register"
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center"
                        >
                            <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                />
                            </svg>
                            Đăng ký
                            <span className="ml-1 text-xs text-blue-200">
                                (Bác sĩ)
                            </span>
                        </Link>
                    </nav>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button className="text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100 transition duration-300">
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HomeNavigateComponent;
