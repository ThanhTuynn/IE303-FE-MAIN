import React, { useState, useEffect } from "react";
import DatePicker from "antd/es/date-picker";
import { Select } from "antd";
import { SearchOutlined, EditOutlined } from "@ant-design/icons";
import Topbar from "../../component/TopbarComponent/TopbarComponent";
import FooterComponent from "../../component/FooterComponent/FooterComponent";
import "./OrderProductPage.scss";
import MiTron from "../../asset/MiTron.jpg";
import Customer1 from "../../asset/customer1.jpg";

const { Option } = Select;

const OrderProductPage = () => {
  const [orders, setOrders] = useState([
    {
      id: 351,
      time: "17-03-2025, 8:28 SA",
      items: [
        { name: "Bánh mì thịt nướng", quantity: 1, price: 25000 },
        { name: "Mì trộn thập cẩm", quantity: 1, price: 25000 },
      ],
      shippingFee: 10000,
      total: 60000,
      paymentMethod: "Tiền mặt",
      status: "Đã giao",
    },
    {
      id: 350,
      time: "17-03-2025, 8:28 SA",
      items: [
        { name: "Bánh mì thịt nướng", quantity: 1, price: 25000 },
        { name: "Mì trộn thập cẩm", quantity: 1, price: 25000 },
      ],
      shippingFee: 10000,
      total: 60000,
      paymentMethod: "Tiền mặt",
      status: "Đang giao",
    },
    {
      id: 349,
      time: "17-03-2025, 8:28 SA",
      items: [
        { name: "Bánh mì thịt nướng", quantity: 1, price: 25000 },
        { name: "Mì trộn thập cẩm", quantity: 1, price: 25000 },
      ],
      shippingFee: 10000,
      total: 60000,
      paymentMethod: "Tiền mặt",
      status: "Đã giao",
    },
    {
      id: 348,
      time: "17-03-2025, 8:28 SA",
      items: [
        { name: "Bánh mì thịt nướng", quantity: 1, price: 25000 },
        { name: "Mì trộn thập cẩm", quantity: 1, price: 25000 },
      ],
      shippingFee: 10000,
      total: 60000,
      paymentMethod: "Tiền mặt",
      status: "Đang giao",
    },
    {
      id: 347,
      time: "17-03-2025, 8:28 SA",
      items: [
        { name: "Bánh mì thịt nướng", quantity: 1, price: 25000 },
        { name: "Mì trộn thập cẩm", quantity: 1, price: 25000 },
      ],
      shippingFee: 10000,
      total: 60000,
      paymentMethod: "Tiền mặt",
      status: "Đã giao",
    },
    {
      id: 346,
      time: "17-03-2025, 8:28 SA",
      items: [
        { name: "Bánh mì thịt nướng", quantity: 1, price: 25000 },
        { name: "Mì trộn thập cẩm", quantity: 1, price: 25000 },
      ],
      shippingFee: 10000,
      total: 60000,
      paymentMethod: "Tiền mặt",
      status: "Đã hủy",
    },
    {
      id: 345,
      time: "17-03-2025, 8:28 SA",
      items: [
        { name: "Bánh mì thịt nướng", quantity: 1, price: 25000 },
        { name: "Mì trộn thập cẩm", quantity: 1, price: 25000 },
      ],
      shippingFee: 10000,
      total: 60000,
      paymentMethod: "Tiền mặt",
      status: "Đang giao",
    },
  ]);

  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editedOrder, setEditedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newOrder, setNewOrder] = useState({
    id: "",
    time: "",
    items: [],
    shippingFee: 0,
    total: 0,
    paymentMethod: "",
    status: "",
  });

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);

    // Lọc đơn hàng theo ngày
    const filtered = orders.filter((order) => {
      const orderDate = order.time.split(",")[0]; // Lấy ngày từ chuỗi thời gian
      return orderDate === dateString;
    });

    setFilteredOrders(filtered);
  };

  const handleEditOrder = (order) => {
    setEditingOrderId(order.id);
    setEditedOrder({ ...order });
  };

  const handleCancelEdit = () => {
    setEditingOrderId(null);
    setEditedOrder(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedOrder({ ...editedOrder, [name]: value });
  };

  const handleStatusChange = (value) => {
    setEditedOrder({ ...editedOrder, status: value });
  };

  const handleSaveOrder = () => {
    const updatedOrders = orders.map((order) =>
      order.id === editingOrderId ? editedOrder : order
    );
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders);
    setEditingOrderId(null);
    setEditedOrder(null);
    alert("Đơn hàng đã được cập nhật thành công!");
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
    setNewOrder({
      id: orders.length + 1, // Tự động tạo ID mới
      time: new Date().toLocaleString("vi-VN"), // Lấy thời gian hiện tại
      items: [],
      shippingFee: 0,
      total: 0,
      paymentMethod: "",
      status: "Đang giao", // Mặc định trạng thái
    });
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setNewOrder({});
  };

  const handleNewOrderChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  const handleSaveNewOrder = () => {
    setOrders([...orders, newOrder]); // Thêm đơn hàng mới vào danh sách
    setFilteredOrders([...orders, newOrder]); // Cập nhật danh sách hiển thị
    setIsModalVisible(false);
    alert("Đơn hàng mới đã được tạo thành công!");
  };

  return (
    <div className="order-card">
      <Topbar title="ĐƠN HÀNG" />
      <div className="main-content">
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
            <DatePicker
              placeholder="Chọn ngày"
              onChange={handleDateChange}
              format="DD-MM-YYYY"
            />
            <div className="filter-item">
              <span>Sắp xếp: Mới nhất</span>
            </div>
            <button className="add-button" onClick={handleOpenModal}>
              + Thêm
            </button>
          </div>
        </div>

        {/* Modal thêm đơn hàng */}
        {isModalVisible && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Thêm đơn hàng mới</h3>
              <div className="form-group">
                <label>Phí vận chuyển</label>
                <input
                  type="number"
                  name="shippingFee"
                  value={newOrder.shippingFee || ""}
                  onChange={handleNewOrderChange}
                />
              </div>
              <div className="form-group">
                <label>Tổng cộng</label>
                <input
                  type="number"
                  name="total"
                  value={newOrder.total || ""}
                  onChange={handleNewOrderChange}
                />
              </div>
              <div className="form-group">
                <label>Phương thức thanh toán</label>
                <input
                  type="text"
                  name="paymentMethod"
                  value={newOrder.paymentMethod || ""}
                  onChange={handleNewOrderChange}
                />
              </div>
              <div className="form-group">
                <label>Tình trạng giao hàng</label>
                <Select
                  value={newOrder.status || ""}
                  onChange={(value) =>
                    setNewOrder({ ...newOrder, status: value })
                  }
                >
                  <Option value="Đã giao">Đã giao</Option>
                  <Option value="Đang giao">Đang giao</Option>
                  <Option value="Đã hủy">Đã hủy</Option>
                </Select>
              </div>
              <div className="form-actions">
                <button className="cancel-button" onClick={handleCloseModal}>
                  Hủy
                </button>
                <button className="save-button" onClick={handleSaveNewOrder}>
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="status-bar">
          {orders.map((order) => {
            let statusClass = "";
            if (order.status === "Đã giao") statusClass = "delivered";
            else if (order.status === "Đang giao") statusClass = "shipping";
            else if (order.status === "Đã hủy") statusClass = "canceled";

            return (
              <button key={order.id} className={`status-button ${statusClass}`}>
                #{order.id}
              </button>
            );
          })}
        </div>

        <div className="order-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              {editingOrderId === order.id ? (
                <div className="edit-order-form">
                  <div className="form-group">
                    <label>Phí vận chuyển</label>
                    <input
                      type="number"
                      name="shippingFee"
                      value={editedOrder.shippingFee || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tổng cộng</label>
                    <input
                      type="number"
                      name="total"
                      value={editedOrder.total || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tình trạng giao hàng</label>
                    <Select
                      value={editedOrder.status || ""}
                      onChange={handleStatusChange}
                      style={{ width: "100%" }}
                    >
                      <Option value="Đã giao">Đã giao</Option>
                      <Option value="Đang giao">Đang giao</Option>
                      <Option value="Đã hủy">Đã hủy</Option>
                    </Select>
                  </div>
                  <div className="form-actions">
                    <button
                      className="cancel-button"
                      onClick={handleCancelEdit}
                    >
                      Hủy
                    </button>
                    <button className="save-button" onClick={handleSaveOrder}>
                      Lưu
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="order-header">
                    <div className="order-info">
                      <span className="order-id">Đơn #{order.id}</span>
                      <span className="order-time">{order.time}</span>
                    </div>
                    <div className="order-avatar">
                      <img src={Customer1} alt="avatar-customer1" />
                      <span>Thèm en</span>
                    </div>
                  </div>
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <img
                          src={MiTron} // Thay bằng link ảnh thực tế
                          alt={item.name}
                          className="item-image"
                        />
                        <div className="item-info">
                          <div className="item-details">
                            <span className="item-name">{item.name}</span>
                            <span className="item-quantity">
                              Số lượng: {item.quantity}
                            </span>
                          </div>
                          <span className="item-price">
                            {item.price.toLocaleString()} VND
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="order-summary">
                      <div className="shipping-fee">
                        <span className="label">Phí vận chuyển:</span>
                        <span className="value">
                          {order.shippingFee.toLocaleString()} VND
                        </span>
                      </div>
                      <div className="total-amount">
                        <span className="label">
                          <strong>Tổng cộng:</strong>
                        </span>
                        <span className="value">
                          {order.total.toLocaleString()} VND
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="order-footer">
                    <div className="order-actions">
                      <button className="payment-method">
                        {order.paymentMethod}
                      </button>
                      <button
                        className={`status-button ${
                          order.status === "Đã giao"
                            ? "delivered"
                            : order.status === "Đang giao"
                            ? "shipping"
                            : "canceled"
                        }`}
                      >
                        {order.status}
                      </button>
                      <button
                        className="edit-button"
                        onClick={() => handleEditOrder(order)}
                      >
                        <EditOutlined /> Sửa
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default OrderProductPage;
