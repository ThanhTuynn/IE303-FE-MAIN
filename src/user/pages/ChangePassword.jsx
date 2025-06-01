import React, { useState, useEffect } from "react";
import { FaUser, FaLock, FaBell, FaSignOutAlt, FaHeart, FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "../components/Toast";

const ChangePassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const storedUserData = localStorage.getItem("userData");
            if (!storedUserData) {
                setError("User data not found. Please log in.");
                setLoading(false);
                return;
            }

            let currentUser = null;
            try {
                currentUser = JSON.parse(storedUserData);
            } catch (parseError) {
                setError("Failed to parse user data.");
                setLoading(false);
                console.error("Parsing user data error:", parseError);
                return;
            }

            const userId = currentUser.id || currentUser._id;

            if (!userId) {
                setError("User ID not found in stored data.");
                setLoading(false);
                return;
            }

            const jwtToken = localStorage.getItem("jwtToken");
            if (!jwtToken) {
                setError("Authentication token not found. Please log in.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/api/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
                setUser(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching user data:", err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    setError("Session expired or unauthorized. Please log in again.");
                } else {
                    setError("Failed to fetch user data.");
                }
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
            toast.warning("Vui lòng điền đầy đủ thông tin.");
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Mật khẩu mới và xác nhận không khớp.");
            return;
        }

        // TODO: Implement API call to change the password on the backend
        console.log("Attempting to change password with data:", formData);

        // ... existing API call ...

        if (response.ok) {
            toast.success("Đổi mật khẩu thành công!");
            // Optionally redirect to login or clear form
            setFormData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } else {
            toast.error("Đổi mật khẩu thất bại. Vui lòng kiểm tra mật khẩu hiện tại.");
        }
    };

    const handleCancel = () => {
        // Navigate back to the profile page
        navigate("/profile");
    };

    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userData");
        window.dispatchEvent(new Event("userLoggedOut"));
        toast.success("Đã đăng xuất!");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-start font-kanit">
            <div className="flex flex-col md:flex-row bg-white rounded-lg shadow p-6 gap-6 max-w-5xl w-full">
                {/* Sidebar */}
                <div className="w-full md:w-1/3 border rounded-lg p-4 text-center flex flex-col items-center">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/706/706830.png"
                        alt="avatar"
                        className="w-24 h-24 rounded-full mb-3"
                    />
                    {loading && <p>Loading user info...</p>}
                    {error && <p className="text-red-600">{error}</p>}
                    {user && (
                        <>
                            <h3 className="text-red-600 font-bold text-lg">
                                {user.fullName || user.username || "User"}
                            </h3>
                            <p className="text-black font-medium">{user.username || user.email || "N/A"}</p>
                        </>
                    )}

                    <ul className="mt-6 w-full space-y-3 text-left">
                        <li>
                            <button
                                onClick={() => navigate("/profile")}
                                className="flex items-center w-full text-left px-2 py-2 rounded hover:bg-gray-100 text-gray-700 hover:text-red-600"
                            >
                                <FaUser className="mr-2" />
                                Thông tin cá nhân
                            </button>
                        </li>
                        <li>
                            <button className="flex items-center w-full text-left px-2 py-2 rounded text-red-600 font-semibold bg-gray-100">
                                <FaLock className="mr-2" />
                                Đổi mật khẩu
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => navigate("/notifications")}
                                className="flex items-center w-full text-left px-2 py-2 rounded hover:bg-gray-100 text-gray-700 hover:text-red-600"
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
                                onClick={handleLogout}
                                className="flex items-center w-full text-left px-2 py-2 rounded hover:bg-gray-100 text-gray-700 hover:text-red-600"
                            >
                                <FaSignOutAlt className="mr-2" />
                                Đăng xuất
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Main content: Đổi mật khẩu */}
                <div className="w-full md:w-2/3 border rounded-lg p-6 bg-white relative">
                    <h2 className="text-red-600 font-bold text-xl mb-6">ĐỔI MẬT KHẨU</h2>
                    <div className="space-y-4 text-base">
                        <div>
                            <label className="font-semibold block mb-1">Mật khẩu cũ:</label>
                            <input
                                type="password"
                                name="oldPassword"
                                value={formData.oldPassword}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                        <div>
                            <label className="font-semibold block mb-1">Mật khẩu mới:</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                        <div>
                            <label className="font-semibold block mb-1">Xác nhận mật khẩu mới:</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-6 space-x-4">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
