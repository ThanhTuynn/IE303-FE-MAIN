import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaBell, FaSignOutAlt, FaHeart, FaHistory } from "react-icons/fa";
import axios from "axios";
import { toast } from "../components/Toast";

const PersonalInformation = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            // Get user data from localStorage
            const storedUserData = localStorage.getItem("userData");
            if (!storedUserData) {
                setError("User data not found in local storage. Please log in.");
                setLoading(false);
                // Optionally redirect to login if user data is not found
                // navigate('/login');
                return;
            }

            let currentUser = null;
            try {
                currentUser = JSON.parse(storedUserData);
            } catch (parseError) {
                setError("Failed to parse user data from local storage.");
                setLoading(false);
                console.error("Parsing user data error:", parseError);
                return;
            }

            // Assuming the user object has an 'id' field
            const userId = currentUser.id || currentUser._id; // Use _id if your backend uses that

            if (!userId) {
                setError("User ID not found in stored data. Please log in again.");
                setLoading(false);
                // Optionally redirect to login
                // navigate('/login');
                return;
            }

            try {
                // Include JWT token in the request headers for authentication
                const jwtToken = localStorage.getItem("jwtToken");
                const response = await axios.get(`http://localhost:8080/api/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
                setUser(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching user data:", err);
                // Check if the error is due to unauthorized access (e.g., expired token)
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    setError("Session expired or unauthorized. Please log in again.");
                    // TODO: Implement proper logout and redirect to login
                    // localStorage.removeItem('jwtToken');
                    // localStorage.removeItem('userData');
                    // navigate('/login');
                } else {
                    setError("Failed to fetch user data. Please try again.");
                }
                setLoading(false);
            }
        };

        fetchUser();
    }, []); // Empty dependency array means this effect runs once on mount

    // Loading state
    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading user data...</div>;
    }

    // Error state
    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;
    }

    // If user data is not available after loading and no error (shouldn't happen if no error and not loading)
    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-600">
                User data could not be loaded.
            </div>
        );
    }

    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userData");
        // Trigger custom event to update header cart count
        window.dispatchEvent(new Event("userLoggedOut"));
        toast.success("Đã đăng xuất!");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-start font-kanit">
            <div className="flex flex-col md:flex-row bg-white rounded-lg shadow p-6 gap-6 max-w-5xl w-full">
                {/* Sidebar */}
                <div className="w-full md:w-1/3 border rounded-lg p-4 text-center flex flex-col items-center">
                    {/* TODO: Replace with actual user avatar if available (e.g., user.avatarUrl)*/}
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/706/706830.png"
                        alt="avatar"
                        className="w-24 h-24 rounded-full mb-3"
                    />
                    {/* Display fetched user data */}
                    <h3 className="text-red-600 font-bold text-lg">{user.name || user.username || "User"}</h3>
                    <p className="text-black font-medium">{user.username || user.email || "N/A"}</p>

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
                                onClick={handleLogout}
                            >
                                <FaSignOutAlt className="mr-2" />
                                Đăng xuất
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Main content */}
                <div className="w-full md:w-2/3 border rounded-lg p-6 relative bg-white">
                    <h2 className="text-red-600 font-bold text-xl mb-6">THÔNG TIN CÁ NHÂN</h2>
                    {/* Link to edit profile - you might pass user data here */}
                    <button
                        onClick={() => navigate("/change-profile", { state: { user } })}
                        className="absolute top-6 right-6 text-blue-600 hover:underline text-sm"
                    >
                        Chỉnh sửa
                    </button>
                    <div className="space-y-3 text-base">
                        {/* Display fetched user data */}
                        <p>
                            <span className="font-semibold">Tên đăng nhập:</span> {user.username || "N/A"}
                        </p>
                        <p>
                            <span className="font-semibold">Họ và tên:</span> {user.name || "N/A"}
                        </p>
                        <p>
                            <span className="font-semibold">Ngày sinh:</span>{" "}
                            {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "N/A"}
                        </p>
                        <p>
                            <span className="font-semibold">Giới tính:</span> {user.gender || "N/A"}
                        </p>
                        <p>
                            <span className="font-semibold">Email:</span> {user.email || "N/A"}
                        </p>
                        <p>
                            <span className="font-semibold">Số điện thoại:</span> {user.phoneNumber || "N/A"}
                        </p>
                        <p>
                            <span className="font-semibold">Địa chỉ:</span> {user.address || "N/A"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalInformation;
