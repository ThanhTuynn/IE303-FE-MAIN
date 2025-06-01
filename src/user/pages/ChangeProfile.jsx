import React, { useState, useEffect } from "react";
import { FaUser, FaLock, FaBell, FaSignOutAlt, FaHeart, FaHistory } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "../components/Toast";

const ChangeProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user: initialUserData } = location.state || {};

    const [formData, setFormData] = useState({
        username: initialUserData?.username || "",
        name: initialUserData?.name || "",
        birthDate: initialUserData?.dateOfBirth
            ? new Date(initialUserData.dateOfBirth).toISOString().split("T")[0]
            : "",
        gender: initialUserData?.gender || "",
        email: initialUserData?.email || "",
        phone: initialUserData?.phoneNumber || "",
        address: initialUserData?.address || "",
    });

    useEffect(() => {
        if (!initialUserData) {
            console.warn("User data not found in location state. Consider fetching from API or redirecting.");
        }
    }, [initialUserData, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        const token = localStorage.getItem("jwtToken");

        if (!token) {
            toast.error("Chưa đăng nhập. Không thể cập nhật thông tin.");
            navigate("/login");
            return;
        }

        let userData;
        try {
            userData = JSON.parse(localStorage.getItem("userData"));
        } catch (error) {
            console.error("Error parsing user data from local storage:", error);
            toast.error("Lỗi xử lý dữ liệu người dùng từ bộ nhớ.");
            return;
        }

        const userId = userData?.id;
        if (!userId) {
            toast.error("Không tìm thấy ID người dùng. Không thể cập nhật thông tin.");
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8080/api/users/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                console.log("Profile updated successfully:", response.data);
                localStorage.setItem("userData", JSON.stringify(response.data));
                toast.success("Thông tin đã được lưu!");
                navigate("/profile");
            } else {
                console.error("Failed to update profile:", response);
                toast.error(`Cập nhật thông tin thất bại: ${response.statusText || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            if (error.response && error.response.status === 401) {
                toast.error("Phiên đăng nhập hết hạn hoặc không được ủy quyền. Vui lòng đăng nhập lại.");
            } else {
                toast.error("Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại.");
            }
        }
    };

    const handleCancel = () => {
        navigate("/profile");
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-start font-kanit">
            <div className="flex flex-col md:flex-row bg-white rounded-lg shadow p-6 gap-6 max-w-5xl w-full">
                <div className="w-full md:w-1/3 border rounded-lg p-4 text-center flex flex-col items-center">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/706/706830.png"
                        alt="avatar"
                        className="w-24 h-24 rounded-full mb-3"
                    />
                    <h3 className="text-red-600 font-bold text-lg">{formData.name || formData.username || "User"}</h3>
                    <p className="text-black font-medium">{formData.username || formData.email || "N/A"}</p>

                    <ul className="mt-6 w-full space-y-3 text-left">
                        <li>
                            <button
                                className="flex items-center text-red-600 font-semibold w-full text-left hover:bg-gray-100 px-2 py-2 rounded"
                                onClick={() => navigate("/profile")}
                            >
                                <FaUser className="mr-2" />
                                Thông tin cá nhân
                            </button>
                        </li>
                        <li>
                            <button
                                className="flex items-center text-gray-700 hover:text-red-600 w-full text-left hover:bg-gray-100 px-2 py-2 rounded"
                                onClick={() => navigate("/change-password")}
                            >
                                <FaLock className="mr-2" />
                                Đổi mật khẩu
                            </button>
                        </li>
                        <li>
                            <button
                                className="flex items-center text-gray-700 hover:text-red-600 w-full text-left hover:bg-gray-100 px-2 py-2 rounded"
                                onClick={() => navigate("/notifications")}
                            >
                                <FaBell className="mr-2" />
                                Thông báo
                            </button>
                        </li>
                        <li>
                            <button
                                className="flex items-center text-gray-700 hover:text-red-600 w-full text-left hover:bg-gray-100 px-2 py-2 rounded"
                                onClick={() => navigate("/favourite")}
                            >
                                <FaHeart className="mr-2" />
                                Món yêu thích
                            </button>
                        </li>

                        <li>
                            <button
                                className="flex items-center text-gray-700 hover:text-red-600 w-full text-left hover:bg-gray-100 px-2 py-2 rounded"
                                onClick={() => navigate("/order-history")}
                            >
                                <FaHistory className="mr-2" />
                                Lịch sử đặt món
                            </button>
                        </li>
                        <li>
                            <button
                                className="flex items-center text-gray-700 hover:text-red-600 w-full text-left hover:bg-gray-100 px-2 py-2 rounded"
                                onClick={() => {
                                    alert("Đã đăng xuất!");
                                    navigate("/login");
                                }}
                            >
                                <FaSignOutAlt className="mr-2" />
                                Đăng xuất
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="w-full md:w-2/3 border rounded-lg p-6 relative bg-white">
                    <h2 className="text-red-600 font-bold text-xl mb-6">CHỈNH SỬA THÔNG TIN</h2>
                    <div className="space-y-4 text-base">
                        {[
                            { label: "Tên đăng nhập", name: "username", disabled: true },
                            { label: "Họ và tên", name: "name" },
                            { label: "Ngày sinh", name: "birthDate", type: "date" },
                            { label: "Giới tính", name: "gender" },
                            { label: "Email", name: "email", type: "email" },
                            { label: "Số điện thoại", name: "phone", type: "tel" },
                            { label: "Địa chỉ", name: "address" },
                        ].map(({ label, name, type = "text", disabled = false }) => (
                            <div key={name}>
                                <label className="font-semibold block mb-1">{label}:</label>
                                <input
                                    type={type}
                                    name={name}
                                    value={formData[name] || ""}
                                    onChange={handleChange}
                                    disabled={disabled}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end mt-6 space-x-4">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangeProfile;
