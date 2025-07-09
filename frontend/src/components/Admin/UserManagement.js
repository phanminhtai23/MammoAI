import React, { useState, useEffect } from "react";
import {
    Edit,
    Trash2,
    Eye,
    Search as SearchIcon,
    Users,
    Settings,
} from "lucide-react";
import {
    Modal,
    Select,
    Switch,
    Input,
    Button,
    Pagination,
    message,
    Spin,
} from "antd";
import dayjs from "dayjs";
import userService from "../../services/userService";

const PAGE_SIZE = 8;

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [filters, setFilters] = useState({
        role: null,
        auth_provider: null,
        is_revoked: null,
    });

    // Fetch users từ API
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                page_size: PAGE_SIZE,
                ...(search && { search }),
                ...(filters.role && { role: filters.role }),
                ...(filters.auth_provider && {
                    auth_provider: filters.auth_provider,
                }),
                ...(filters.is_revoked !== null && {
                    is_revoked: filters.is_revoked,
                }),
            };

            const response = await userService.getUsersAdmin(params);

            if (response.data.status_code === 200) {
                setUsers(response.data.data.users);
                setTotalUsers(response.data.data.pagination.total_users);
            } else {
                message.error("Lỗi khi tải danh sách user");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            message.error(
                "Không thể tải danh sách user: " +
                    (error.response?.data?.detail || error.message)
            );
        } finally {
            setLoading(false);
        }
    };

    // Effect để fetch users khi component mount hoặc params thay đổi
    useEffect(() => {
        fetchUsers();
    }, [currentPage, search, filters]);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCurrentPage(1); // Reset về trang 1 khi search
            fetchUsers();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
        setCurrentPage(1); // Reset về trang 1 khi filter
    };

    const handleEdit = async (user) => {
        try {
            // Fetch chi tiết user trước khi edit
            const response = await userService.getUserDetailAdmin(user.id);
            if (response.data.status_code === 200) {
                setSelectedUser({ ...response.data.data });
                setIsEditModalOpen(true);
            }
        } catch (error) {
            message.error("Không thể lấy thông tin user");
        }
    };

    const handleDetail = async (user) => {
        try {
            const response = await userService.getUserDetailAdmin(user.id);
            if (response.data.status_code === 200) {
                setSelectedUser(response.data.data);
                setIsDetailModalOpen(true);
            }
        } catch (error) {
            message.error("Không thể lấy thông tin user");
        }
    };

    const handleDelete = async (userId) => {
        Modal.confirm({
            title: "Xác nhận xóa user",
            content: "Bạn có chắc chắn muốn xóa user này không?",
            okText: "Xóa",
            cancelText: "Hủy",
            okType: "danger",
            onOk: async () => {
                try {
                    const response = await userService.deleteUserAdmin(userId);
                    if (response.data.status_code === 200) {
                        message.success("Xóa user thành công");
                        fetchUsers(); // Refresh danh sách
                    }
                } catch (error) {
                    message.error(
                        "Không thể xóa user: " +
                            (error.response?.data?.detail || error.message)
                    );
                }
            },
        });
    };

    const handleEditSave = async () => {
        try {
            const updateData = {
                role: selectedUser.role,
                isRevoked: selectedUser.isRevoked,
                confirmed: selectedUser.confirmed,
            };

            const response = await userService.updateUserAdmin(
                selectedUser.id,
                updateData
            );
            if (response.data.status_code === 200) {
                message.success("Cập nhật user thành công");
                setIsEditModalOpen(false);
                fetchUsers(); // Refresh danh sách
            }
        } catch (error) {
            message.error(
                "Không thể cập nhật user: " +
                    (error.response?.data?.detail || error.message)
            );
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-white shadow-xl w-full h-screen flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-white px-4 py-3 shadow-sm flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-200 p-2 bg-gray-100 rounded-lg">
                            <Settings size={24} className="text-gray-600" />
                        </div>
                        <div className="text-gray-800 font-bold text-xl">
                            Admin Dashboard
                        </div>
                    </div>
                    <div className="bg-gray-200 px-4 py-2 rounded-full border border-gray-200">
                        <span className="text-gray-700 font-medium">
                            Quản lý người dùng
                        </span>
                    </div>
                </div>
            </div>

            {/* Thanh tìm kiếm và filter */}
            <div className="px-4 py-3 bg-white border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <SearchIcon size={20} />
                        </div>
                        <Input
                            placeholder="Tìm kiếm theo tên hoặc ID người dùng..."
                            value={search}
                            onChange={handleSearch}
                            className="pl-10 pr-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 border-0 border-gray-200 focus:shadow-md focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                            style={{ fontSize: "14px" }}
                        />
                    </div>
                    <div className="flex items-center gap-3 ml-6">
                        <div className="text-sm text-gray-500">
                            Tổng số:{" "}
                            <span className="font-semibold text-gray-700">
                                {totalUsers}
                            </span>{" "}
                            người dùng
                        </div>
                        <div className="h-6 w-px bg-gray-300"></div>
                        <div className="text-sm text-gray-500">
                            Trang:{" "}
                            <span className="font-semibold text-gray-700">
                                {currentPage}
                            </span>
                            /{Math.ceil(totalUsers / PAGE_SIZE)}
                        </div>
                    </div>
                </div>

                {/* Filter row */}
                <div className="flex items-center gap-4">
                    <Select
                        placeholder="Lọc theo role"
                        allowClear
                        style={{ width: 150 }}
                        value={filters.role}
                        onChange={(value) => handleFilterChange("role", value)}
                        options={[
                            { value: "admin", label: "Admin" },
                            { value: "user", label: "User" },
                        ]}
                    />
                    <Select
                        placeholder="Lọc theo provider"
                        allowClear
                        style={{ width: 150 }}
                        value={filters.auth_provider}
                        onChange={(value) =>
                            handleFilterChange("auth_provider", value)
                        }
                        options={[
                            { value: "local", label: "Local" },
                            { value: "google", label: "Google" },
                            { value: "facebook", label: "Facebook" },
                        ]}
                    />
                    <Select
                        placeholder="Trạng thái"
                        allowClear
                        style={{ width: 150 }}
                        value={filters.is_revoked}
                        onChange={(value) =>
                            handleFilterChange("is_revoked", value)
                        }
                        options={[
                            { value: false, label: "Hoạt động" },
                            { value: true, label: "Bị khóa" },
                        ]}
                    />
                </div>
            </div>

            {/* Bảng user với loading */}
            <div
                style={{ height: "calc(100vh - 180px)" }}
                className="flex flex-col border border-gray-200 shadow-sm bg-white overflow-hidden"
            >
                <Spin spinning={loading}>
                    <div className="flex-1 overflow-auto">
                        <table className="w-full bg-white table-fixed">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-4 text-center text-gray-700 font-semibold text-sm uppercase tracking-wider w-12">
                                        STT
                                    </th>
                                    <th className="py-3 px-4 text-left text-gray-700 font-semibold text-sm uppercase tracking-wider w-40">
                                        Tên người dùng
                                    </th>
                                    <th className="py-3 px-4 text-left text-gray-700 font-semibold text-sm uppercase tracking-wider w-24">
                                        Provider
                                    </th>
                                    <th className="py-3 px-4 text-left text-gray-700 font-semibold text-sm uppercase tracking-wider w-20">
                                        Role
                                    </th>
                                    <th className="py-3 px-4 text-left text-gray-700 font-semibold text-sm uppercase tracking-wider w-32">
                                        Ngày tạo
                                    </th>
                                    <th className="py-3 px-4 text-center text-gray-700 font-semibold text-sm uppercase tracking-wider w-32">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((user, index) => (
                                    <tr
                                        key={user.id}
                                        className={`hover:bg-blue-50/50 transition-all duration-200 ${
                                            index % 2 === 0
                                                ? "bg-white"
                                                : "bg-gray-50/30"
                                        }`}
                                    >
                                        <td className="py-3 px-4 text-gray-800 truncate text-center font-medium">
                                            {(currentPage - 1) * PAGE_SIZE +
                                                index +
                                                1}
                                        </td>
                                        <td className="py-4 px-6 text-gray-800 truncate">
                                            {user.name}
                                        </td>
                                        <td className="py-4 px-6 text-gray-600 truncate">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    user.auth_provider ===
                                                    "google"
                                                        ? "bg-red-100 text-red-800"
                                                        : user.auth_provider ===
                                                          "facebook"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {user.auth_provider}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-800 truncate">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    user.role === "admin"
                                                        ? "bg-purple-100 text-purple-800"
                                                        : "bg-green-100 text-green-800"
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600 truncate text-sm">
                                            {dayjs(user.created_at).format(
                                                "DD/MM/YYYY HH:mm"
                                            )}
                                        </td>
                                        <td className="py-4 px-6 flex items-center justify-center gap-2">
                                            <Button
                                                icon={<Eye size={18} />}
                                                className="!bg-blue-100 !text-blue-700 hover:!bg-blue-200 !border-0 !shadow-sm hover:!shadow-md transition-all"
                                                onClick={() =>
                                                    handleDetail(user)
                                                }
                                                size="small"
                                            />
                                            <Button
                                                icon={<Edit size={18} />}
                                                className="!bg-amber-100 !text-amber-700 hover:!bg-amber-200 !border-0 !shadow-sm hover:!shadow-md transition-all"
                                                onClick={() => handleEdit(user)}
                                                size="small"
                                            />
                                            <Button
                                                icon={<Trash2 size={18} />}
                                                className="!bg-red-100 !text-red-700 hover:!bg-red-200 !border-0 !shadow-sm hover:!shadow-md transition-all"
                                                onClick={() =>
                                                    handleDelete(user.id)
                                                }
                                                size="small"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Spin>

                {/* Pagination */}
                <div className="flex justify-between items-center px-4 py-3 bg-gray-50/50 border-t border-gray-200 flex-shrink-0">
                    <div className="text-sm text-gray-600">
                        Hiển thị{" "}
                        <span className="font-medium">
                            {(currentPage - 1) * PAGE_SIZE + 1}
                        </span>{" "}
                        đến{" "}
                        <span className="font-medium">
                            {Math.min(currentPage * PAGE_SIZE, totalUsers)}
                        </span>{" "}
                        của <span className="font-medium">{totalUsers}</span>{" "}
                        kết quả
                    </div>
                    <Pagination
                        current={currentPage}
                        pageSize={PAGE_SIZE}
                        total={totalUsers}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        className="[&_.ant-pagination-item]:border-gray-300 [&_.ant-pagination-item:hover]:border-gray-400 [&_.ant-pagination-item:hover]:bg-gray-200 [&_.ant-pagination-item:hover]:text-black [&_.ant-pagination-item-active]:bg-gray-400 [&_.ant-pagination-item-active]:border-gray-400 [&_.ant-pagination-item-active>a]:text-black [&_.ant-pagination-prev:hover]:border-gray-400 [&_.ant-pagination-next:hover]:border-gray-400 [&_.ant-pagination-item-active>a]:text-black"
                    />
                </div>
            </div>

            {/* Modal xem chi tiết - same as before */}
            <Modal
                open={isDetailModalOpen}
                onCancel={() => setIsDetailModalOpen(false)}
                footer={null}
                title="Chi tiết người dùng"
                bodyStyle={{ paddingLeft: 16, paddingRight: 16 }}
            >
                {selectedUser && (
                    <div className="space-y-2 px-4">
                        <div className="flex justify-center mb-2">
                            <img
                                src={
                                    selectedUser.imgUrl ||
                                    "https://ui-avatars.com/api/?name=" +
                                        encodeURIComponent(selectedUser.name)
                                }
                                alt="avatar"
                                className="w-20 h-20 rounded-full object-cover border-2 border-blue-400"
                            />
                        </div>
                        <div>
                            <b>ID:</b> {selectedUser.id}
                        </div>
                        <div>
                            <b>Tên:</b> {selectedUser.name}
                        </div>
                        <div>
                            <b>Email:</b> {selectedUser.email}
                        </div>
                        <div>
                            <b>Provider:</b> {selectedUser.auth_provider}
                        </div>
                        <div>
                            <b>Role:</b> {selectedUser.role}
                        </div>
                        <div>
                            <b>isRevoked:</b>{" "}
                            {selectedUser.isRevoked ? "True" : "False"}
                        </div>
                        <div>
                            <b>Confirmed:</b>{" "}
                            {selectedUser.confirmed ? "True" : "False"}
                        </div>
                        <div>
                            <b>Ngày tạo:</b>{" "}
                            {dayjs(selectedUser.created_at).format(
                                "DD/MM/YYYY HH:mm"
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal chỉnh sửa - same as before */}
            <Modal
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={handleEditSave}
                title="Chỉnh sửa người dùng"
                okText="Lưu"
                cancelText="Hủy"
            >
                {selectedUser && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-600 mb-1">
                                Role
                            </label>
                            <Select
                                value={selectedUser.role}
                                onChange={(v) =>
                                    setSelectedUser((u) => ({ ...u, role: v }))
                                }
                                className="w-full"
                                options={[
                                    { value: "user", label: "User" },
                                    { value: "admin", label: "Admin" },
                                ]}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">
                                isRevoked
                            </label>
                            <Switch
                                checked={selectedUser.isRevoked}
                                onChange={(v) =>
                                    setSelectedUser((u) => ({
                                        ...u,
                                        isRevoked: v,
                                    }))
                                }
                                checkedChildren="True"
                                unCheckedChildren="False"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">
                                Confirmed
                            </label>
                            <Switch
                                checked={selectedUser.confirmed}
                                onChange={(v) =>
                                    setSelectedUser((u) => ({
                                        ...u,
                                        confirmed: v,
                                    }))
                                }
                                checkedChildren="True"
                                unCheckedChildren="False"
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default UserManagement;
