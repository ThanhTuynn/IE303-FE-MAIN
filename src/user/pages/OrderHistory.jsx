import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaBell, FaSignOutAlt, FaHeart, FaHistory } from "react-icons/fa";
import axios from "axios";

const statusColor = {
    PENDING: "text-yellow-600", // Assuming PENDING is a possible status from backend
    CONFIRMED: "text-blue-600", // Assuming CONFIRMED is a possible status from backend
    PREPARING: "text-yellow-600", // Assuming PREPARING is a possible status from backend
    READY: "text-blue-600", // Assuming READY is a possible status from backend
    DELIVERED: "text-green-600", // Assuming DELIVERED is a possible status from backend
    CANCELLED: "text-red-600", // Assuming CANCELLED is a possible status from backend
    // Map your backend statuses to appropriate colors
};

const OrderHistory = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]); // State to store fetched orders
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState(null); // State to track any errors
    const [userId, setUserId] = useState(null); // State to store the user ID

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        const userData = localStorage.getItem("userData");

        if (!token || !userData) {
            alert("Please log in to view your order history.");
            navigate("/login");
            return;
        }

        try {
            const user = JSON.parse(userData);
            // Try both id and _id for compatibility
            const userIdFromStorage = user.id || user._id;
            if (!userIdFromStorage) {
                console.error("No user ID found in localStorage:", user);
                alert("User ID not found. Please log in again.");
                navigate("/login");
                return;
            }
            setUserId(userIdFromStorage);
            console.log("🔍 OrderHistory - User ID:", userIdFromStorage);
            console.log("🔍 OrderHistory - Full user data:", user);
        } catch (e) {
            console.error("Failed to parse user data from localStorage:", e);
            alert("Error retrieving user data. Please log in again.");
            navigate("/login");
            return;
        }

        const fetchOrderHistory = async (id, authToken) => {
            try {
                setLoading(true);
                console.log("📞 Making API call to get orders for user ID:", id);
                console.log("📞 API URL:", `http://localhost:8080/api/orders/user/${id}`);

                const response = await axios.get(`http://localhost:8080/api/orders/user/${id}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                console.log("📦 Order history response:", response);
                console.log("📦 Order history data:", response.data);
                console.log("📦 Number of orders:", response.data ? response.data.length : 0);

                setOrders(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
                console.error("❌ Error fetching order history:", err);
                console.error("❌ Error response:", err.response);
                console.error("❌ Error status:", err.response ? err.response.status : "No status");
                console.error("❌ Error data:", err.response ? err.response.data : "No response data");
                alert("Failed to fetch order history. Check console for details.");
            }
        };

        if (userId) {
            fetchOrderHistory(userId, token);
        }
    }, [userId, navigate]); // Depend on userId and navigate

    if (loading) {
        return <div className="text-center py-8">Loading order history...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">Error loading order history: {error.message}</div>;
    }

    if (!loading && !error && orders.length === 0) {
        return (
            <div className="text-center py-10 font-kanit">
                <h1 className="text-4xl md:text-5xl font-extrabold text-red-600 mb-4">KHÔNG CÓ ĐƠN HÀNG NÀO</h1>
                <p className="text-gray-700 mb-6">Hãy đặt món đầu tiên của bạn ngay nào!</p>
                <button
                    onClick={() => navigate("/menu")}
                    className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition duration-300"
                >
                    Đến Menu
                </button>
            </div>
        );
    }

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
                    <h3 className="text-red-600 font-bold text-lg">Võ Thị Phương Uyên</h3>
                    <p className="text-black font-medium">pu0406@</p>

                    <ul className="mt-6 w-full space-y-3 text-left">
                        <li>
                            <button
                                className="flex items-center text-gray-700 hover:text-red-600 w-full text-left hover:bg-gray-100 px-2 py-2 rounded"
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
                                className="flex items-center text-red-600 font-semibold w-full text-left hover:bg-gray-100 px-2 py-2 rounded"
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

                {/* Main content */}
                <div className="w-full md:w-2/3 border rounded-lg p-6 bg-white">
                    <h2 className="text-red-600 font-bold text-xl mb-6">LỊCH SỬ ĐẶT MÓN</h2>

                    {/* Render orders from state */}
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="border rounded-lg p-4 bg-gray-50 shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold text-lg text-blue-700">
                                        Đơn hàng #{order.id.substring(0, 8)}...
                                    </h3>
                                    <span className={`font-medium ${statusColor[order.status]}`}>
                                        Trạng thái: {order.status}
                                    </span>
                                </div>
                                <p className="text-gray-700 text-sm mb-2">
                                    Đặt lúc: {new Date(order.createdAt).toLocaleString()}
                                </p>
                                <p className="text-gray-700 text-sm mb-3">Địa chỉ giao hàng: {order.deliveryAddress}</p>

                                <div className="space-y-2 border-t border-gray-200 pt-3">
                                    <p className="font-semibold text-gray-800">Các món đã đặt:</p>
                                    {order.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="flex items-center pl-4">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded-md mr-3"
                                            />
                                            <div className="flex-1">
                                                <p className="text-gray-800 font-medium">{item.name}</p>
                                                <p className="text-gray-600 text-sm">Số lượng: {item.quantity}</p>
                                                <p className="text-gray-600 text-sm">
                                                    Giá: {item.price?.toLocaleString("vi-VN")}đ
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 border-t border-gray-200 pt-3 flex justify-between items-center">
                                    <p className="font-bold text-lg text-red-600">
                                        Tổng cộng: {order.totalAmount?.toLocaleString("vi-VN")}đ
                                    </p>
                                    <span
                                        className={`font-medium ${
                                            order.paymentStatus === "COMPLETED" ? "text-green-600" : "text-yellow-600"
                                        }`}
                                    >
                                        Thanh toán: {order.paymentStatus}
                                    </span>
                                </div>
                                {order.specialInstructions && (
                                    <div className="mt-2 text-gray-600 text-sm">
                                        Ghi chú: {order.specialInstructions}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;
