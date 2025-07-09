import React, { useState } from "react";
import {
    Edit,
    Trash2,
    Eye,
    Search as SearchIcon,
    Users,
    Settings,
} from "lucide-react";
import { Modal, Select, Switch, Input, Button, Pagination } from "antd";
import dayjs from "dayjs";

const mockUsers = [
    {
        id: "1",
        name: "Nguyen Van A",
        auth_provider: "local",
        role: "user",
        isRevoked: false,
        created_at: "2024-06-01T10:00:00Z",
        imgUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        id: "2",
        name: "Tran Thi B",
        auth_provider: "google",
        role: "admin",
        isRevoked: true,
        created_at: "2024-05-15T08:30:00Z",
        imgUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        id: "3",
        name: "Le Van C",
        auth_provider: "facebook",
        role: "user",
        isRevoked: false,
        created_at: "2024-04-20T14:45:00Z",
        imgUrl: "",
    },
    {
        id: "4",
        name: "Pham Minh D",
        auth_provider: "local",
        role: "user",
        isRevoked: false,
        created_at: "2024-03-10T09:00:00Z",
        imgUrl: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
        id: "5",
        name: "Hoang Thi E",
        auth_provider: "google",
        role: "admin",
        isRevoked: false,
        created_at: "2024-02-18T11:20:00Z",
        imgUrl: "https://randomuser.me/api/portraits/women/55.jpg",
    },
    {
        id: "6",
        name: "Nguyen Van F",
        auth_provider: "facebook",
        role: "user",
        isRevoked: false,
        created_at: "2024-01-25T15:10:00Z",
        imgUrl: "",
    },
    {
        id: "7",
        name: "Tran Van G",
        auth_provider: "local",
        role: "user",
        isRevoked: false,
        created_at: "2023-12-30T08:00:00Z",
        imgUrl: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    {
        id: "8",
        name: "Le Thi H",
        auth_provider: "google",
        role: "admin",
        isRevoked: false,
        created_at: "2023-11-12T10:30:00Z",
        imgUrl: "https://randomuser.me/api/portraits/women/22.jpg",
    },
    {
        id: "9",
        name: "Pham Van I",
        auth_provider: "facebook",
        role: "user",
        isRevoked: false,
        created_at: "2023-10-05T13:45:00Z",
        imgUrl: "",
    },
    {
        id: "10",
        name: "Hoang Van J",
        auth_provider: "local",
        role: "user",
        isRevoked: false,
        created_at: "2023-09-15T17:00:00Z",
        imgUrl: "https://randomuser.me/api/portraits/men/23.jpg",
    },
    {
        id: "11",
        name: "Nguyen Thi K",
        auth_provider: "google",
        role: "admin",
        isRevoked: false,
        created_at: "2023-08-20T19:20:00Z",
        imgUrl: "https://randomuser.me/api/portraits/women/33.jpg",
    },
    {
        id: "12",
        name: "Tran Van L",
        auth_provider: "facebook",
        role: "user",
        isRevoked: false,
        created_at: "2023-07-25T21:10:00Z",
        imgUrl: "",
    },
    {
        id: "13",
        name: "Le Van M",
        auth_provider: "local",
        role: "user",
        isRevoked: false,
        created_at: "2023-06-30T08:00:00Z",
        imgUrl: "https://randomuser.me/api/portraits/men/14.jpg",
    },
    {
        id: "14",
        name: "Pham Thi N",
        auth_provider: "google",
        role: "admin",
        isRevoked: false,
        created_at: "2023-05-12T10:30:00Z",
        imgUrl: "https://randomuser.me/api/portraits/women/24.jpg",
    },
    {
        id: "15",
        name: "Hoang Van O",
        auth_provider: "facebook",
        role: "user",
        isRevoked: false,
        created_at: "2023-04-05T13:45:00Z",
        imgUrl: "",
    },
    {
        id: "16",
        name: "Nguyen Van P",
        auth_provider: "local",
        role: "user",
        isRevoked: false,
        created_at: "2023-03-10T09:00:00Z",
        imgUrl: "https://randomuser.me/api/portraits/men/46.jpg",
    },
    {
        id: "17",
        name: "Tran Thi Q",
        auth_provider: "google",
        role: "admin",
        isRevoked: false,
        created_at: "2023-02-18T11:20:00Z",
        imgUrl: "https://randomuser.me/api/portraits/women/56.jpg",
    },
    {
        id: "18",
        name: "Le Van R",
        auth_provider: "facebook",
        role: "user",
        isRevoked: false,
        created_at: "2023-01-25T15:10:00Z",
        imgUrl: "",
    },
    {
        id: "19",
        name: "Pham Van S",
        auth_provider: "local",
        role: "user",
        isRevoked: false,
        created_at: "2022-12-30T08:00:00Z",
        imgUrl: "https://randomuser.me/api/portraits/men/13.jpg",
    },
    {
        id: "20",
        name: "Hoang Thi T",
        auth_provider: "google",
        role: "admin",
        isRevoked: false,
        created_at: "2022-11-12T10:30:00Z",
        imgUrl: "https://randomuser.me/api/portraits/women/25.jpg",
    },
    {
        id: "21",
        name: "Nguyen Van U",
        auth_provider: "facebook",
        role: "user",
        isRevoked: false,
        created_at: "2022-10-05T13:45:00Z",
        imgUrl: "",
    },
    {
        id: "22",
        name: "Tran Van V",
        auth_provider: "local",
        role: "user",
        isRevoked: false,
        created_at: "2022-09-15T17:00:00Z",
        imgUrl: "https://randomuser.me/api/portraits/men/24.jpg",
    },
    {
        id: "23",
        name: "Le Thi W",
        auth_provider: "google",
        role: "admin",
        isRevoked: false,
        created_at: "2022-08-20T19:20:00Z",
        imgUrl: "https://randomuser.me/api/portraits/women/34.jpg",
    },
    {
        id: "24",
        name: "Pham Van X",
        auth_provider: "facebook",
        role: "user",
        isRevoked: false,
        created_at: "2022-07-25T21:10:00Z",
        imgUrl: "",
    },
    {
        id: "25",
        name: "Hoang Van Y",
        auth_provider: "local",
        role: "user",
        isRevoked: false,
        created_at: "2022-06-30T08:00:00Z",
        imgUrl: "https://randomuser.me/api/portraits/men/15.jpg",
    },
    {
        id: "26",
        name: "Nguyen Thi Z",
        auth_provider: "google",
        role: "admin",
        isRevoked: false,
        created_at: "2022-05-12T10:30:00Z",
        imgUrl: "https://randomuser.me/api/portraits/women/26.jpg",
    },
    {
        id: "27",
        name: "Tran Van AA",
        auth_provider: "facebook",
        role: "user",
        isRevoked: false,
        created_at: "2022-04-05T13:45:00Z",
        imgUrl: "",
    },
    {
        id: "28",
        name: "Le Van AB",
        auth_provider: "local",
        role: "user",
        isRevoked: false,
        created_at: "2022-03-10T09:00:00Z",
        imgUrl: "https://randomuser.me/api/portraits/men/47.jpg",
    },
    {
        id: "29",
        name: "Pham Thi AC",
        auth_provider: "google",
        role: "admin",
        isRevoked: false,
        created_at: "2022-02-18T11:20:00Z",
        imgUrl: "https://randomuser.me/api/portraits/women/57.jpg",
    },
    {
        id: "30",
        name: "Hoang Van AD",
        auth_provider: "facebook",
        role: "user",
        isRevoked: false,
        created_at: "2022-01-25T15:10:00Z",
        imgUrl: "",
    },
    {
        id: "13",
        name: "Le Van M",
        auth_provider: "local",
        role: "user",
        isRevoked: false,
        created_at: "2023-06-30T08:00:00Z",
        imgUrl: "https://randomuser.me/api/portraits/men/14.jpg",
    },
    {
        id: "14",
        name: "Pham Thi N",
        auth_provider: "google",
        role: "admin",
        isRevoked: false,
        created_at: "2023-05-12T10:30:00Z",
        imgUrl: "https://randomuser.me/api/portraits/women/24.jpg",
    },
    {
        id: "15",
        name: "Hoang Van O",
        auth_provider: "facebook",
        role: "user",
        isRevoked: false,
        created_at: "2023-04-05T13:45:00Z",
        imgUrl: "",
    },
    {
        id: "16",
        name: "Nguyen Van P",
        auth_provider: "local",
        role: "user",
        isRevoked: false,
        created_at: "2023-03-10T09:00:00Z",
        imgUrl: "https://randomuser.me/api/portraits/men/46.jpg",
    },
    {
        id: "17",
        name: "Tran Thi Q",
        auth_provider: "google",
        role: "admin",
        isRevoked: false,
        created_at: "2023-02-18T11:20:00Z",
        imgUrl: "https://randomuser.me/api/portraits/women/56.jpg",
    },
    {
        id: "18",
        name: "Le Van R",
        auth_provider: "facebook",
        role: "user",
        isRevoked: false,
        created_at: "2023-01-25T15:10:00Z",
        imgUrl: "",
    },
    {
        id: "19",
        name: "Pham Van S",
        auth_provider: "local",
        role: "user",
        isRevoked: false,
        created_at: "2022-12-30T08:00:00Z",
        imgUrl: "https://randomuser.me/api/portraits/men/13.jpg",
    },
    {
        id: "20",
        name: "Hoang Thi T",
        auth_provider: "google",
        role: "admin",
        isRevoked: false,
        created_at: "2022-11-12T10:30:00Z",
        imgUrl: "https://randomuser.me/api/portraits/women/25.jpg",
    },
    {
        id: "21",
        name: "Nguyen Van U",
        auth_provider: "facebook",
        role: "user",
        isRevoked: false,
        created_at: "2022-10-05T13:45:00Z",
        imgUrl: "",
    },
    {
        id: "22",
        name: "Tran Van V",
        auth_provider: "local",
        role: "user",
        isRevoked: false,
        created_at: "2022-09-15T17:00:00Z",
        imgUrl: "https://randomuser.me/api/portraits/men/24.jpg",
    },
    {
        id: "23",
        name: "Le Thi W",
        auth_provider: "google",
        role: "admin",
        isRevoked: false,
        created_at: "2022-08-20T19:20:00Z",
        imgUrl: "https://randomuser.me/api/portraits/women/34.jpg",
    },
    {
        id: "24",
        name: "Pham Van X",
        auth_provider: "facebook",
        role: "user",
        isRevoked: false,
        created_at: "2022-07-25T21:10:00Z",
        imgUrl: "",
    },
    {
        id: "25",
        name: "Hoang Van Y",
        auth_provider: "local",
        role: "user",
        isRevoked: false,
        created_at: "2022-06-30T08:00:00Z",
        imgUrl: "https://randomuser.me/api/portraits/men/15.jpg",
    },
    {
        id: "26",
        name: "Nguyen Thi Z",
        auth_provider: "google",
        role: "admin",
        isRevoked: false,
        created_at: "2022-05-12T10:30:00Z",
        imgUrl: "https://randomuser.me/api/portraits/women/26.jpg",
    },
    {
        id: "27",
        name: "Tran Van AA",
        auth_provider: "facebook",
        role: "user",
        isRevoked: false,
        created_at: "2022-04-05T13:45:00Z",
        imgUrl: "",
    },
    {
        id: "28",
        name: "Le Van AB",
        auth_provider: "local",
        role: "user",
        isRevoked: false,
        created_at: "2022-03-10T09:00:00Z",
        imgUrl: "https://randomuser.me/api/portraits/men/47.jpg",
    },
    {
        id: "29",
        name: "Pham Thi AC",
        auth_provider: "google",
        role: "admin",
        isRevoked: false,
        created_at: "2022-02-18T11:20:00Z",
        imgUrl: "https://randomuser.me/api/portraits/women/57.jpg",
    },
    {
        id: "30",
        name: "Hoang Van AD",
        auth_provider: "facebook",
        role: "user",
        isRevoked: false,
        created_at: "2022-01-25T15:10:00Z",
        imgUrl: "",
    },
];

const PAGE_SIZE = 8;

const UserManagement = () => {
    const [users, setUsers] = useState(mockUsers);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const filteredUsers = users.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.id.includes(search)
    );

    const pageCount = Math.ceil(filteredUsers.length / PAGE_SIZE);
    const pagedUsers = filteredUsers.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const handleEdit = (user) => {
        setSelectedUser({ ...user });
        setIsEditModalOpen(true);
    };

    const handleDetail = (user) => {
        setSelectedUser(user);
        setIsDetailModalOpen(true);
    };

    const handleDelete = (id) => {
        setUsers(users.filter((u) => u.id !== id));
    };

    const handleEditSave = () => {
        setUsers((prev) =>
            prev.map((u) => (u.id === selectedUser.id ? selectedUser : u))
        );
        setIsEditModalOpen(false);
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-white shadow-xl w-full h-screen flex flex-col overflow-hidden">
            {/* Header nhẹ nhàng */}
            <div className="bg-white px-4 py-3 shadow-sm  flex-shrink-0">
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

            {/* Thanh tìm kiếm đẹp */}
            <div className="px-4 py-3 bg-white border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <SearchIcon size={20} />
                        </div>
                        <Input
                            placeholder="Tìm kiếm theo tên hoặc ID người dùng..."
                            value={search}
                            onChange={handleSearch}
                            className="pl-10 pr-4 py-3 rounded-xl bg-gray-50 hover:bg-grap-100 border-0 border--gray-200 focus:shadow-md focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                            style={{ fontSize: "14px" }}
                        />
                    </div>
                    <div className="flex items-center gap-3 ml-6">
                        <div className="text-sm text-gray-500">
                            Tổng số:{" "}
                            <span className="font-semibold text-gray-700">
                                {filteredUsers.length}
                            </span>{" "}
                            người dùng
                        </div>
                        <div className="h-6 w-px bg-gray-300"></div>
                        <div className="text-sm text-gray-500">
                            Trang:{" "}
                            <span className="font-semibold text-gray-700">
                                {currentPage}
                            </span>
                            /{Math.ceil(filteredUsers.length / PAGE_SIZE)}
                        </div>
                    </div>
                </div>
            </div>
            {/* Bảng user đẹp - cố định height */}
            <div
                style={{ height: "calc(100vh - 140px)" }}
                className="flex flex-col border border-gray-200 shadow-sm bg-white overflow-hidden"
            >
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
                            {pagedUsers.map((user, index) => (
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
                                                user.auth_provider === "google"
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
                                            onClick={() => handleDetail(user)}
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
                {/* Pagination đẹp cố định dưới cùng */}
                <div className="flex justify-between items-center px-4 py-3 bg-gray-50/50 border-t border-gray-200 flex-shrink-0">
                    <div className="text-sm text-gray-600">
                        Hiển thị{" "}
                        <span className="font-medium">
                            {(currentPage - 1) * PAGE_SIZE + 1}
                        </span>{" "}
                        đến{" "}
                        <span className="font-medium">
                            {Math.min(
                                currentPage * PAGE_SIZE,
                                filteredUsers.length
                            )}
                        </span>{" "}
                        của{" "}
                        <span className="font-medium">
                            {filteredUsers.length}
                        </span>{" "}
                        kết quả
                    </div>
                    <Pagination
                        current={currentPage}
                        pageSize={PAGE_SIZE}
                        total={filteredUsers.length}
                        onChange={setCurrentPage}
                        showSizeChanger={false}
                        className="
  [&_.ant-pagination-item]:border-gray-300
  [&_.ant-pagination-item:hover]:border-gray-400
  [&_.ant-pagination-item:hover]:bg-gray-200
  [&_.ant-pagination-item:hover]:text-black
  [&_.ant-pagination-item-active]:bg-gray-400
  [&_.ant-pagination-item-active]:border-gray-400
  [&_.ant-pagination-item-active>a]:text-black
  [&_.ant-pagination-prev:hover]:border-gray-400
  [&_.ant-pagination-next:hover]:border-gray-400
  [&_.ant-pagination-item-active>a]:text-black
"
                    />
                </div>
            </div>
            {/* Modal xem chi tiết */}
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
                            <b>Ngày tạo:</b>{" "}
                            {dayjs(selectedUser.created_at).format(
                                "DD/MM/YYYY HH:mm"
                            )}
                        </div>
                    </div>
                )}
            </Modal>
            {/* Modal chỉnh sửa */}
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
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default UserManagement;
