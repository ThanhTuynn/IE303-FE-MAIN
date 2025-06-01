import React, { useState, useEffect } from "react";
import { DollarOutlined, ShoppingOutlined, HeartOutlined, GiftOutlined, SearchOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";
import Topbar from "../../component/TopbarComponent/TopbarComponent";
import FooterComponent from "../../component/FooterComponent/FooterComponent";
import "./DashboardPage.scss";
import axios from 'axios';

const Dashboard = () => {
    const [filterStatus, setFilterStatus] = useState(""); // Bộ lọc trạng thái
    const [filterPayment, setFilterPayment] = useState(""); // Bộ lọc thanh toán
    const [filterDate, setFilterDate] = useState(null);
    const [orders, setOrders] = useState([]); // State để lưu trữ đơn hàng từ API
    const [loading, setLoading] = useState(true); // State để theo dõi trạng thái loading
    const [error, setError] = useState(null); // State để lưu trữ lỗi
    const [userData, setUserData] = useState({}); // State để lưu trữ thông tin user

    useEffect(() => {
        fetchOrders();
    }, []); // Chạy một lần khi component mount

    const fetchUserData = async (userId) => {
        if (userData[userId]) return userData[userId]; // Return cached data if available
        
        const token = localStorage.getItem('jwtToken');
        if (!token) return null;

        try {
            const response = await axios.get(`http://localhost:8080/api/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUserData(prev => ({...prev, [userId]: response.data}));
            return response.data;
        } catch (err) {
            console.error('Error fetching user data:', err);
            return null;
        }
    };

    const fetchOrders = async () => {
        const token = localStorage.getItem('jwtToken'); // Lấy token từ localStorage
        if (!token) {
            setError("No authentication token found. Please log in.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setOrders(response.data); // Cập nhật state orders với dữ liệu từ API
            
            // Fetch user data for each order
            const userIds = [...new Set(response.data.map(order => order.userId))];
            for (const userId of userIds) {
                await fetchUserData(userId);
            }
            
            setError(null);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError("Failed to load orders. Please try again.");
            setOrders([]); // Xóa dữ liệu cũ nếu có lỗi
        } finally {
            setLoading(false);
        }
    };

    // Lọc danh sách đơn hàng dựa trên trạng thái và phương thức thanh toán
    const filteredOrders = orders.filter((order) => {
        const statusMatch = filterStatus ? order.status === filterStatus : true;
        const paymentMatch = filterPayment ? order.payment === filterPayment : true;
        const dateMatch = filterDate ? order.createdAt.includes(filterDate.format("YYYY-MM-DD")) : true;
        return statusMatch && paymentMatch && dateMatch;
    });

    const handleStatusChange = async (orderId, newStatus) => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.error("No authentication token found");
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8080/api/orders/${orderId}/status`, null, {
                params: { status: newStatus },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const updatedOrder = response.data;
            const updatedOrdersList = orders.map((order) =>
                order.id === orderId ? updatedOrder : order
            );
            setOrders(updatedOrdersList);

            console.log(`Order ${orderId} status updated to ${newStatus}`);

        } catch (err) {
            console.error('Error updating order status:', err.response ? err.response.data : err.message);
            setError("Failed to update order status. Please try lại.");
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <Topbar title="Dashboard" />
                <div className="main-content">
                    <p>Đang tải đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <Topbar title="Dashboard" />
                <div className="main-content">
                    <p style={{ color: 'red' }}>Lỗi: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <Topbar title="Dashboard" />
            <div className="main-content">
                {/* Thanh thống kê */}
                <div className="stats-bar">
                    {[
                        {
                            title: "Tổng doanh thu",
                            value: "2,615,000 VNĐ",
                            change: "+14.05%",
                            color: "#C1853B",
                            icon: <DollarOutlined />,
                        },
                        {
                            title: "Tổng đơn hàng",
                            value: "100 đơn",
                            change: "+10.07%",
                            color: "#A68A01",
                            icon: <ShoppingOutlined />,
                        },
                        {
                            title: "Món ăn ưu chuộng",
                            value: "198 yêu thích",
                            change: "-2.84%",
                            color: "#FF7401",
                            icon: <HeartOutlined />,
                        },
                        {
                            title: "Chương trình khuyến mãi",
                            value: "285 mã",
                            change: "+4.05%",
                            color: "#F2A38D",
                            icon: <GiftOutlined />,
                        },
                    ].map((stat, index) => (
                        <div key={index} className="stat-item">
                            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                                {stat.icon}
                            </div>
                            <div className="stat-content">
                                <h3>{stat.title}</h3>
                                <p style={{ color: stat.color }}>{stat.value}</p> {/* Áp dụng màu sắc */}
                                <span>{stat.change} so với tuần trước</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Thanh tìm kiếm và bộ lọc */}
                <div className="filter-bar">
                    {/* Phần bên trái */}
                    <div className="filter-left">
                        <div className="filter-item">
                            <SearchOutlined />
                            <input type="text" placeholder="Tìm kiếm" />
                        </div>
                    </div>

                    {/* Phần bên phải */}
                    <div className="filter-right">
                        <div className="filter-item">
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="">Tất cả trạng thái</option>
                                <option value="Đã giao">Đã giao</option>
                                <option value="Đang giao">Đang giao</option>
                                <option value="Đã hủy">Đã hủy</option>
                            </select>
                        </div>
                        <div className="filter-item">
                            <select value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)}>
                                <option value="">Tất cả thanh toán</option>
                                <option value="Tiền mặt">Tiền mặt</option>
                                <option value="Ngân hàng">Ngân hàng</option>
                                <option value="MoMo">MoMo</option>
                            </select>
                        </div>
                        <div className="filter-item">
                            <DatePicker
                                placeholder="Chọn ngày"
                                onChange={(date) => setFilterDate(date)}
                                format="DD/MM/YYYY"
                            />
                        </div>
                    </div>
                </div>

                {/* Bảng dữ liệu */}
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Thời gian</th>
                                <th>Trạng thái</th>
                                <th>Đơn hàng</th>
                                <th>Khách hàng</th>
                                <th>Tổng tiền</th>
                                <th>Thanh toán</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>{new Date(order.createdAt).toLocaleString('vi-VN')}</td>
                                    <td>
                                        <span
                                            className={`status ${
                                                order.status === "DELIVERED"
                                                    ? "success"
                                                    : order.status === "PENDING" || order.status === "PREPARING"
                                                    ? "warning"
                                                    : order.status === "CANCELLED"
                                                    ? "error"
                                                    : ""
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        {
                                            order.items.map((item, itemIndex) => (
                                                <div key={itemIndex}>
                                                    {item.quantity} x {item.name}
                                                </div>
                                            ))
                                        }
                                    </td>
                                    <td>{userData[order.userId]?.username || 'Loading...'}</td>
                                    <td>{order.totalAmount.toLocaleString('vi-VN')} VNĐ</td>
                                    <td>
                                        <button
                                            className={`payment-btn ${
                                                order.paymentMethod === "Tiền mặt"
                                                    ? "cash"
                                                    : order.paymentMethod === "Ngân hàng"
                                                    ? "bank"
                                                    : order.paymentMethod === "MoMo"
                                                    ? "momo"
                                                    : ""
                                            }`}
                                        >
                                            {order.paymentMethod}
                                        </button>
                                    </td>
                                    <td>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        >
                                            <option value="PENDING">PENDING</option>
                                            <option value="CONFIRMED">CONFIRMED</option>
                                            <option value="PREPARING">PREPARING</option>
                                            <option value="READY">READY</option>
                                            <option value="DELIVERED">DELIVERED</option>
                                            <option value="CANCELLED">CANCELLED</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <FooterComponent />
        </div>
    );
};

export default Dashboard;
