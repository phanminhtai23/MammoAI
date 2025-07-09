import React, { useState, useEffect } from "react";
import {
    Users,
    UserCheck,
    TrendingUp,
    BarChart3,
    PieChart,
    Activity,
    Calendar,
    Settings,
} from "lucide-react";
import { Select, Card, Statistic, DatePicker } from "antd";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

// Mock data
const mockStatistics = {
    totalUsers: 1247,
    onlineUsers: 89,
    newUsersThisMonth: 156,
    averageSessions: 4.2,
};

const mockNewUsersByMonth = [
    { month: "01/2024", users: 45, label: "Tháng 1" },
    { month: "02/2024", users: 67, label: "Tháng 2" },
    { month: "03/2024", users: 89, label: "Tháng 3" },
    { month: "04/2024", users: 123, label: "Tháng 4" },
    { month: "05/2024", users: 98, label: "Tháng 5" },
    { month: "06/2024", users: 156, label: "Tháng 6" },
    { month: "07/2024", users: 134, label: "Tháng 7" },
    { month: "08/2024", users: 178, label: "Tháng 8" },
    { month: "09/2024", users: 145, label: "Tháng 9" },
    { month: "10/2024", users: 167, label: "Tháng 10" },
    { month: "11/2024", users: 189, label: "Tháng 11" },
    { month: "12/2024", users: 201, label: "Tháng 12" },
];

const mockAuthProviderData = [
    { name: "Local", value: 654, color: "#6B7280" },
    { name: "Google", value: 423, color: "#3B82F6" },
    { name: "Facebook", value: 170, color: "#60A5FA" },
];

const mockLoginsByDay = [
    { date: "01/12", logins: 234, label: "1 Dec" },
    { date: "02/12", logins: 187, label: "2 Dec" },
    { date: "03/12", logins: 298, label: "3 Dec" },
    { date: "04/12", logins: 276, label: "4 Dec" },
    { date: "05/12", logins: 345, label: "5 Dec" },
    { date: "06/12", logins: 189, label: "6 Dec" },
    { date: "07/12", logins: 267, label: "7 Dec" },
    { date: "08/12", logins: 312, label: "8 Dec" },
    { date: "09/12", logins: 298, label: "9 Dec" },
    { date: "10/12", logins: 356, label: "10 Dec" },
    { date: "11/12", logins: 289, label: "11 Dec" },
    { date: "12/12", logins: 423, label: "12 Dec" },
    { date: "13/12", logins: 367, label: "13 Dec" },
    { date: "14/12", logins: 398, label: "14 Dec" },
];

const UserTraffic = () => {
    const [selectedMonths, setSelectedMonths] = useState(6);
    const [loginPeriod, setLoginPeriod] = useState("day");
    const [dateRange, setDateRange] = useState([
        dayjs().subtract(13, "days"),
        dayjs(),
    ]);

    const getFilteredNewUsers = () => {
        return mockNewUsersByMonth.slice(-selectedMonths);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat("vi-VN").format(num);
    };

    return (
        <>
            {/* CSS inline để giảm padding Card */}
            {/* <style>
                {`
                .user-traffic-cards .ant-card .ant-card-body {
                    padding: 8px !important;
                }
                .user-traffic-cards .ant-statistic {
                    margin: 0 !important;
                }
                `}
            </style> */}
            <div className="bg-gradient-to-br from-gray-50 to-white w-full h-screen flex flex-col overflow-hidden">
                {/* Content - Cố định height */}
                <div
                    style={{ height: "calc(100vh - 0px)" }}
                    className="p-2 overflow-hidden flex flex-col"
                >
                    {/* Statistics Cards - Thu nhỏ tối đa */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-2 user-traffic-cards">
                        <Card className="border-gray-200 shadow-sm">
                            <Statistic
                                title={
                                    <span className="text-gray-600 font-medium text-xs">
                                        Tổng số người dùng
                                    </span>
                                }
                                value={mockStatistics.totalUsers}
                                formatter={(value) => formatNumber(value)}
                                prefix={
                                    <Users
                                        className="text-blue-500"
                                        size={30}
                                    />
                                }
                                valueStyle={{
                                    color: "#374151",
                                    fontSize: "30px",
                                    fontWeight: "bold",
                                }}
                            />
                        </Card>

                        <Card className="border-gray-200 shadow-sm">
                            <Statistic
                                title={
                                    <span className="text-gray-600 font-medium text-xs">
                                        Đang online
                                    </span>
                                }
                                value={mockStatistics.onlineUsers}
                                formatter={(value) => formatNumber(value)}
                                prefix={
                                    <UserCheck
                                        className="text-green-500"
                                        size={30}
                                    />
                                }
                                valueStyle={{
                                    color: "#059669",
                                    fontSize: "30px",
                                    fontWeight: "bold",
                                }}
                            />
                        </Card>

                        <Card className="border-gray-200 shadow-sm">
                            <Statistic
                                title={
                                    <span className="text-gray-600 font-medium text-xs">
                                        Người dùng mới tháng này
                                    </span>
                                }
                                value={mockStatistics.newUsersThisMonth}
                                formatter={(value) => formatNumber(value)}
                                prefix={
                                    <TrendingUp
                                        className="text-blue-600"
                                        size={30}
                                    />
                                }
                                valueStyle={{
                                    color: "#2563EB",
                                    fontSize: "30px",
                                    fontWeight: "bold",
                                }}
                            />
                        </Card>

                        <Card className="border-gray-200 shadow-sm">
                            <Statistic
                                title={
                                    <span className="text-gray-600 font-medium text-xs">
                                        Phiên trung bình
                                    </span>
                                }
                                value={mockStatistics.averageSessions}
                                precision={1}
                                prefix={
                                    <BarChart3
                                        className="text-purple-500"
                                        size={30}
                                    />
                                }
                                valueStyle={{
                                    color: "#7C3AED",
                                    fontSize: "30px",
                                    fontWeight: "bold",
                                }}
                            />
                        </Card>
                    </div>

                    {/* Charts Grid - Layout mới theo yêu cầu */}
                    <div
                        className="grid grid-cols-1 lg:grid-cols-3 gap-2"
                        style={{ height: "calc(100vh - 140px)" }}
                    >
                        {/* Cột trái - Chứa 2 biểu đồ xếp dọc */}
                        <div className="lg:col-span-2 space-y-3 h-full flex flex-col">
                            {/* New Users by Month - Area Chart */}
                            <Card
                                title={
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-800 font-medium text-xs">
                                            Người dùng mới theo tháng
                                        </span>
                                        <Select
                                            value={selectedMonths}
                                            onChange={setSelectedMonths}
                                            className="w-24"
                                            size="small"
                                            options={[
                                                { value: 3, label: "3 Tháng" },
                                                { value: 6, label: "6 Tháng" },
                                                { value: 12, label: "12 Tháng" },
                                            ]}
                                        />
                                    </div>
                                }
                                className="border-gray-200 shadow-sm flex-1"
                            >
                                <ResponsiveContainer width="100%" height={160}>
                                    <AreaChart data={getFilteredNewUsers()}>
                                        <defs>
                                            <linearGradient
                                                id="colorUsers"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#3B82F6"
                                                    stopOpacity={0.3}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#3B82F6"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#E5E7EB"
                                        />
                                        <XAxis
                                            dataKey="label"
                                            stroke="#6B7280"
                                            fontSize={10}
                                            height={30}
                                        />
                                        <YAxis
                                            stroke="#6B7280"
                                            fontSize={10}
                                            width={35}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "white",
                                                border: "1px solid #E5E7EB",
                                                borderRadius: "8px",
                                                boxShadow:
                                                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="users"
                                            stroke="#3B82F6"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorUsers)"
                                            dot={{
                                                fill: "#3B82F6",
                                                strokeWidth: 2,
                                                r: 4,
                                            }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Card>

                            {/* Login Sessions by Day - Bar Chart */}
                            <Card
                                title={
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-800 font-medium text-xs">
                                            Lượt đăng nhập theo ngày
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Select
                                                value={loginPeriod}
                                                onChange={setLoginPeriod}
                                                className="w-16"
                                                size="small"
                                                options={[
                                                    {
                                                        value: "day",
                                                        label: "D",
                                                    },
                                                    {
                                                        value: "week",
                                                        label: "W",
                                                    },
                                                    {
                                                        value: "month",
                                                        label: "M",
                                                    },
                                                ]}
                                            />
                                            <RangePicker
                                                value={dateRange}
                                                onChange={setDateRange}
                                                format="DD/MM"
                                                size="small"
                                            />
                                        </div>
                                    </div>
                                }
                                className="border-gray-200 shadow-sm flex-1 min-h-0"
                            >
                                <ResponsiveContainer width="100%" height={140}>
                                    <BarChart data={mockLoginsByDay}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#E5E7EB"
                                        />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#6B7280"
                                            fontSize={10}
                                            height={30}
                                        />
                                        <YAxis
                                            stroke="#6B7280"
                                            fontSize={10}
                                            width={35}
                                        />
                                        <Tooltip
                                            formatter={(value) => [
                                                formatNumber(value),
                                                "Lượt đăng nhập",
                                            ]}
                                            contentStyle={{
                                                backgroundColor: "white",
                                                border: "1px solid #E5E7EB",
                                                borderRadius: "8px",
                                                boxShadow:
                                                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                            }}
                                        />
                                        <Bar
                                            dataKey="logins"
                                            fill="#2563EB"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>

                        {/* Cột phải - Auth Provider Distribution - Pie Chart với chú thích */}
                        <div className="lg:col-span-1">
                            <Card
                                title={
                                    <span className="text-gray-800 font-medium text-xs">
                                        Phân bố theo nhà cung cấp
                                    </span>
                                }
                                className="border-gray-200 shadow-sm h-full"
                            >
                                <div className="flex flex-col h-full">
                                    <ResponsiveContainer
                                        width="100%"
                                        height={320}
                                    >
                                        <RechartsPieChart>
                                            <Pie
                                                data={mockAuthProviderData}
                                                cx="50%"
                                                cy="45%"
                                                labelLine={false}
                                                label={({ percent }) =>
                                                    `${(percent * 100).toFixed(
                                                        0
                                                    )}%`
                                                }
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {mockAuthProviderData.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.color}
                                                        />
                                                    )
                                                )}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value) => [
                                                    formatNumber(value),
                                                    "Người dùng",
                                                ]}
                                                contentStyle={{
                                                    backgroundColor: "white",
                                                    border: "1px solid #E5E7EB",
                                                    borderRadius: "8px",
                                                    boxShadow:
                                                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                                }}
                                            />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>

                                    {/* Chú thích màu sắc nằm dưới */}
                                    <div className="mt-2 space-y-1">
                                        {mockAuthProviderData.map(
                                            (item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-1"
                                                >
                                                    <div
                                                        className="w-2 h-2 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                item.color,
                                                        }}
                                                    ></div>
                                                    <span className="text-xs text-gray-600">
                                                        {item.name === "Google"
                                                            ? "Gmail"
                                                            : item.name ===
                                                              "Facebook"
                                                            ? "Facebook"
                                                            : item.name}
                                                    </span>
                                                    <span className="text-xs font-medium text-gray-800 ml-auto">
                                                        {formatNumber(
                                                            item.value
                                                        )}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserTraffic;
