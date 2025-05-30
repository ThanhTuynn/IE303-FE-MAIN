import React, { useState } from "react";
import { DollarOutlined, ShoppingOutlined, HeartOutlined, GiftOutlined, SearchOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";
import Topbar from "../../component/TopbarComponent/TopbarComponent";
import FooterComponent from "../../component/FooterComponent/FooterComponent";
import "./DashboardPage.scss";

const Dashboard = () => {
    const [filterStatus, setFilterStatus] = useState(""); // Bộ lọc trạng thái
    const [filterPayment, setFilterPayment] = useState(""); // Bộ lọc thanh toán
    const [filterDate, setFilterDate] = useState(null);

    const orders = [
        {
            time: "17:30 28/04/2025",
            status: "Đã giao",
            order: "01 bánh tráng nướng, 02 ly trà sữa full topping",
            customer: "Bảo Ân",
            total: "75,000 VNĐ",
            payment: "Tiền mặt",
        },
        {
            time: "14:15 27/04/2025",
            status: "Đang giao",
            order: "02 phần cơm gà, 01 ly nước cam",
            customer: "Minh Anh",
            total: "120,000 VNĐ",
            payment: "Ngân hàng",
        },
        {
            time: "10:00 26/04/2025",
            status: "Đã hủy",
            order: "03 bánh mì thịt nướng",
            customer: "Ngọc Trâm",
            total: "45,000 VNĐ",
            payment: "MoMo",
        },
        {
            time: "18:45 25/04/2025",
            status: "Đã giao",
            order: "01 pizza hải sản, 02 ly coca",
            customer: "Hữu Phước",
            total: "250,000 VNĐ",
            payment: "Ngân hàng",
        },
        {
            time: "12:30 24/04/2025",
            status: "Đang giao",
            order: "02 phần bún bò Huế",
            customer: "Thanh Tâm",
            total: "90,000 VNĐ",
            payment: "Tiền mặt",
        },
        {
            time: "17:30 28/04/2025",
            status: "Đã giao",
            order: "01 bánh tráng nướng, 02 ly trà sữa full topping",
            customer: "Bảo Ân",
            total: "75,000 VNĐ",
            payment: "Tiền mặt",
        },
        {
            time: "14:15 27/04/2025",
            status: "Đang giao",
            order: "02 phần cơm gà, 01 ly nước cam",
            customer: "Minh Anh",
            total: "120,000 VNĐ",
            payment: "Ngân hàng",
        },
        {
            time: "10:00 26/04/2025",
            status: "Đã hủy",
            order: "03 bánh mì thịt nướng",
            customer: "Ngọc Trâm",
            total: "45,000 VNĐ",
            payment: "MoMo",
        },
        {
            time: "18:45 25/04/2025",
            status: "Đã giao",
            order: "01 pizza hải sản, 02 ly coca",
            customer: "Hữu Phước",
            total: "250,000 VNĐ",
            payment: "Ngân hàng",
        },
        {
            time: "12:30 24/04/2025",
            status: "Đang giao",
            order: "02 phần bún bò Huế",
            customer: "Thanh Tâm",
            total: "90,000 VNĐ",
            payment: "Tiền mặt",
        },
        {
            time: "17:30 28/04/2025",
            status: "Đã giao",
            order: "01 bánh tráng nướng, 02 ly trà sữa full topping",
            customer: "Bảo Ân",
            total: "75,000 VNĐ",
            payment: "Tiền mặt",
        },
        {
            time: "14:15 27/04/2025",
            status: "Đang giao",
            order: "02 phần cơm gà, 01 ly nước cam",
            customer: "Minh Anh",
            total: "120,000 VNĐ",
            payment: "Ngân hàng",
        },
        {
            time: "10:00 26/04/2025",
            status: "Đã hủy",
            order: "03 bánh mì thịt nướng",
            customer: "Ngọc Trâm",
            total: "45,000 VNĐ",
            payment: "MoMo",
        },
        {
            time: "18:45 25/04/2025",
            status: "Đã giao",
            order: "01 pizza hải sản, 02 ly coca",
            customer: "Hữu Phước",
            total: "250,000 VNĐ",
            payment: "Ngân hàng",
        },
        {
            time: "12:30 24/04/2025",
            status: "Đang giao",
            order: "02 phần bún bò Huế",
            customer: "Thanh Tâm",
            total: "90,000 VNĐ",
            payment: "Tiền mặt",
        },
        {
            time: "17:30 28/04/2025",
            status: "Đã giao",
            order: "01 bánh tráng nướng, 02 ly trà sữa full topping",
            customer: "Bảo Ân",
            total: "75,000 VNĐ",
            payment: "Tiền mặt",
        },
        {
            time: "14:15 27/04/2025",
            status: "Đang giao",
            order: "02 phần cơm gà, 01 ly nước cam",
            customer: "Minh Anh",
            total: "120,000 VNĐ",
            payment: "Ngân hàng",
        },
        {
            time: "10:00 26/04/2025",
            status: "Đã hủy",
            order: "03 bánh mì thịt nướng",
            customer: "Ngọc Trâm",
            total: "45,000 VNĐ",
            payment: "MoMo",
        },
        {
            time: "18:45 25/04/2025",
            status: "Đã giao",
            order: "01 pizza hải sản, 02 ly coca",
            customer: "Hữu Phước",
            total: "250,000 VNĐ",
            payment: "Ngân hàng",
        },
        {
            time: "12:30 24/04/2025",
            status: "Đang giao",
            order: "02 phần bún bò Huế",
            customer: "Thanh Tâm",
            total: "90,000 VNĐ",
            payment: "Tiền mặt",
        },
    ];

    // Lọc danh sách đơn hàng dựa trên trạng thái và phương thức thanh toán
    const filteredOrders = orders.filter((order) => {
        const statusMatch = filterStatus ? order.status === filterStatus : true;
        const paymentMatch = filterPayment ? order.payment === filterPayment : true;
        const dateMatch = filterDate ? order.time.includes(filterDate.format("DD/MM/YYYY")) : true;
        return statusMatch && paymentMatch && dateMatch;
    });

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
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order, index) => (
                                <tr key={index}>
                                    <td>{order.time}</td>
                                    <td>
                                        <span
                                            className={`status ${
                                                order.status === "Đã giao"
                                                    ? "success"
                                                    : order.status === "Đang giao"
                                                    ? "warning"
                                                    : "error"
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>{order.order}</td>
                                    <td>{order.customer}</td>
                                    <td>{order.total}</td>
                                    <td>
                                        <button
                                            className={`payment-btn ${
                                                order.payment === "Tiền mặt"
                                                    ? "cash"
                                                    : order.payment === "Ngân hàng"
                                                    ? "bank"
                                                    : "momo"
                                            }`}
                                        >
                                            {order.payment}
                                        </button>
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
