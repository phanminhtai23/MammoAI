import React, { useState } from "react";
import { Edit, Trash2, Eye, Search as SearchIcon, Users } from "lucide-react";
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

const PAGE_SIZE = 10;

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
        <div className="bg-white rounded-xl shadow p-3 w-full h-[600px] relative min-h-[500px]">
            {/* Header nhỏ trên cùng */}
            <div className="flex items-center justify-between mb-4 px-2 py-2 bg-gray-50 rounded-lg shadow-sm">
                <div className="flex items-center gap-2">
                    <Users size={24} className="text-blue-600" />
                    <span className="font-bold text-lg text-gray-700">
                        Admin Dashboard
                    </span>
                </div>
                <div className="text-base font-semibold text-blue-700">
                    Quản lý người dùng
                </div>
            </div>
            {/* Thanh tìm kiếm */}
            <div className="flex items-center mb-6">
                <div className="relative w-1/3 mr-4">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <SearchIcon size={18} />
                    </span>
                    <Input
                        placeholder="Tìm kiếm theo tên hoặc ID..."
                        value={search}
                        onChange={handleSearch}
                        className="pl-9 pr-2 py-2 rounded-full bg-gray-50 border border-gray-200 focus:border-blue-400 focus:shadow focus:bg-white transition-all"
                    />
                </div>
                <span className="text-xl font-semibold text-blue-700">
                    Quản lý người dùng
                </span>
            </div>
            {/* Bảng user */}
            <div className="overflow-x-auto overflow-y-auto rounded-lg border border-gray-100 pb-16 max-h-[350px]">
                <table className="min-w-full bg-white">
                    <thead className="bg-blue-50">
                        <tr>
                            <th className="py-2 px-4 text-left text-gray-600 font-medium">
                                ID
                            </th>
                            <th className="py-2 px-4 text-left text-gray-600 font-medium">
                                Tên
                            </th>
                            <th className="py-2 px-4 text-left text-gray-600 font-medium">
                                Provider
                            </th>
                            <th className="py-2 px-4 text-left text-gray-600 font-medium">
                                Role
                            </th>
                            <th className="py-2 px-4 text-left text-gray-600 font-medium">
                                Ngày tạo
                            </th>
                            <th className="py-2 px-4 text-center text-gray-600 font-medium">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagedUsers.map((user) => (
                            <tr
                                key={user.id}
                                className="hover:bg-blue-50 transition-all border-b border-gray-100"
                            >
                                <td className="py-2 px-4 text-gray-800">
                                    {user.id}
                                </td>
                                <td className="py-2 px-4 text-gray-800">
                                    {user.name}
                                </td>
                                <td className="py-2 px-4 text-gray-800">
                                    {user.auth_provider}
                                </td>
                                <td className="py-2 px-4 text-gray-800 capitalize">
                                    {user.role}
                                </td>
                                <td className="py-2 px-4 text-gray-800">
                                    {dayjs(user.created_at).format(
                                        "DD/MM/YYYY HH:mm"
                                    )}
                                </td>
                                <td className="py-2 px-4 flex items-center justify-center gap-2">
                                    <Button
                                        icon={<Eye size={18} />}
                                        className="!bg-blue-100 !text-blue-700 hover:!bg-blue-200"
                                        onClick={() => handleDetail(user)}
                                    />
                                    <Button
                                        icon={<Edit size={18} />}
                                        className="!bg-yellow-100 !text-yellow-700 hover:!bg-yellow-200"
                                        onClick={() => handleEdit(user)}
                                    />
                                    <Button
                                        icon={<Trash2 size={18} />}
                                        className="!bg-red-100 !text-red-700 hover:!bg-red-200"
                                        onClick={() => handleDelete(user.id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination cố định dưới cùng */}
            <div className="flex justify-center w-full absolute left-0 bottom-0 bg-white py-2 border-t border-gray-100">
                <Pagination
                    current={currentPage}
                    pageSize={PAGE_SIZE}
                    total={filteredUsers.length}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                />
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
