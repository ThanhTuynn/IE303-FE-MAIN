import React, { useState, useEffect } from "react";
import DatePicker from "antd/es/date-picker";
import { Select } from "antd";
import { SearchOutlined, EditOutlined } from "@ant-design/icons";
import Topbar from "../../component/TopbarComponent/TopbarComponent";
import FooterComponent from "../../component/FooterComponent/FooterComponent";
import "./OrderProductPage.scss";
import MiTron from "../../asset/MiTron.jpg";
import Customer1 from "../../asset/customer1.jpg";
import axios from 'axios';

const { Option } = Select;

const OrderProductPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editedOrder, setEditedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newOrder, setNewOrder] = useState({
    items: [],
    shippingFee: 0,
    total: 0,
    paymentMethod: "",
    status: "PENDING",
  });

  // Fetch orders when component mounts
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('jwtToken');
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
      console.log('Fetched orders:', response.data);
      setOrders(response.data);
      setFilteredOrders(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError("Failed to load orders. Please try again.");
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);

    // Filter orders by date
    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.createdAt).toLocaleDateString('vi-VN');
      return orderDate === dateString;
    });

    setFilteredOrders(filtered);
  };

  const handleEditOrder = (order) => {
    setEditingOrderId(order._id);
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

  // Function to handle updating order status (called when dropdown changes)
  const handleStatusChange = (value) => {
    // Update the status in the editedOrder state. Saving happens on button click.
    setEditedOrder(prevState => ({
        ...prevState,
        status: value
    }));
  };

  // Function to handle saving all edits (called when Save button is clicked)
  const handleSaveOrder = async () => {
     const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert("No authentication token found. Please log in.");
      return;
    }

    if (!editedOrder || !editedOrder._id) {
        alert("No order selected for editing.");
        return;
    }

    try {
        // Construct the data to send - including status, shipping fee, and total
        const updateData = {
            shippingFee: parseFloat(editedOrder.shippingFee),
            total: parseFloat(editedOrder.total),
            status: editedOrder.status // Include the status from the state
        };

        console.log('Sending order update data:', updateData);

        // Use a PATCH endpoint for partial updates or PUT if the backend expects the whole object
        const response = await axios.patch(
            `http://localhost:8080/api/orders/${editedOrder._id}`,
            updateData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Order updated:', response.data);

        // Update local state with the updated order
        const updatedOrders = orders.map(order =>
            order._id === editedOrder._id ? response.data : order
        );
        setOrders(updatedOrders);

        // Re-apply the date filter if one is active
        if (selectedDate) {
           const filtered = updatedOrders.filter((order) => {
              const orderDate = new Date(order.createdAt).toLocaleDateString('vi-VN');
              return orderDate === selectedDate;
           });
           setFilteredOrders(filtered);
        } else {
           setFilteredOrders(updatedOrders);
        }

        setEditingOrderId(null); // Close the edit form
        setEditedOrder(null); // Clear the edited order state
        alert("Order updated successfully!");

    } catch (err) {
        console.error('Error updating order:', err.response ? err.response.data : err.message);
        alert("Failed to update order. Please try again.");
    }
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
    setNewOrder({
      items: [],
      shippingFee: 0,
      total: 0,
      paymentMethod: "",
      status: "PENDING",
    });
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setNewOrder({
      items: [],
      shippingFee: 0,
      total: 0,
      paymentMethod: "",
      status: "PENDING",
    });
  };

  const handleNewOrderChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  const handleSaveNewOrder = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert("No authentication token found. Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/orders',
        newOrder,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setOrders([...orders, response.data]);
      // Re-apply filter if date is selected, otherwise update filteredOrders with all orders
       if (selectedDate) {
          const filtered = [...orders, response.data].filter((order) => {
             const orderDate = new Date(order.createdAt).toLocaleDateString('vi-VN');
             return orderDate === selectedDate;
          });
          setFilteredOrders(filtered);
       } else {
          setFilteredOrders([...orders, response.data]);
       }

      setIsModalVisible(false);
      alert("New order created successfully!");
    } catch (err) {
      console.error('Error creating order:', err);
      alert("Failed to create order. Please try again.");
    }
  };

  // Add this helper function at the top level of the component
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleString('vi-VN');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="order-card">
        <Topbar title="ĐƠN HÀNG" />
        <div className="main-content">
          <p>Loading orders...</p>
        </div>
        <FooterComponent />
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-card">
        <Topbar title="ĐƠN HÀNG" />
        <div className="main-content">
          <p style={{ color: 'red' }}>{error}</p>
        </div>
        <FooterComponent />
      </div>
    );
  }

  return (
    <div className="order-card">
      <Topbar title="ĐƠN HÀNG" />
      <div className="main-content">
        {/* Filter bar */}
        <div className="filter-bar">
          <div className="filter-left">
            <div className="filter-item">
              <SearchOutlined />
              <input type="text" placeholder="Tìm kiếm" />
            </div>
          </div>

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

        {/* Add Order Modal */}
        {isModalVisible && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Thêm đơn hàng mới</h3>
              <div className="form-group">
                <label>Phí vận chuyển</label>
                <input
                  type="number"
                  name="shippingFee"
                  value={newOrder.shippingFee}
                  onChange={handleNewOrderChange}
                />
              </div>
              <div className="form-group">
                <label>Tổng cộng</label>
                <input
                  type="number"
                  name="total"
                  value={newOrder.total}
                  onChange={handleNewOrderChange}
                />
              </div>
              <div className="form-group">
                <label>Phương thức thanh toán</label>
                <input
                  type="text"
                  name="paymentMethod"
                  value={newOrder.paymentMethod}
                  onChange={handleNewOrderChange}
                />
              </div>
              <div className="form-group">
                <label>Tình trạng giao hàng</label>
                <Select
                  value={newOrder.status}
                  onChange={(value) => setNewOrder({ ...newOrder, status: value })}
                >
                  <Option value="PENDING">Chờ xác nhận</Option>
                  <Option value="CONFIRMED">Đã xác nhận</Option>
                  <Option value="SHIPPING">Đang giao</Option>
                  <Option value="DELIVERED">Đã giao</Option>
                  <Option value="CANCELLED">Đã hủy</Option>
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

        {/* Status bar */}
        <div className="status-bar">
          {orders.map((order) => {
            let statusClass = "";
            switch (order.status) {
              case "DELIVERED":
                statusClass = "delivered";
                break;
              case "SHIPPING":
                statusClass = "shipping";
                break;
              case "CANCELLED":
                statusClass = "canceled";
                break;
              case "CONFIRMED":
                 statusClass = "confirmed";
                 break;
              case "PENDING":
                 statusClass = "pending";
                 break;
              default:
                statusClass = "";
            }

            return (
              <button key={order._id} className={`status-button ${statusClass}`}>
                #{order._id}
              </button>
            );
          })}
        </div>

        {/* Order list */}
        <div className="order-list">
          {filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              {editingOrderId === order._id ? (
                <div className="edit-order-form">
                  <div className="form-group">
                    <label>Phí vận chuyển</label>
                    <input
                      type="number"
                      name="shippingFee"
                      value={editedOrder.shippingFee}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tổng cộng</label>
                    <input
                      type="number"
                      name="total"
                      value={editedOrder.total}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tình trạng giao hàng</label>
                    <Select
                      value={editedOrder.status}
                      onChange={handleStatusChange} // This updates the state, save happens on button click
                      style={{ width: "100%" }}
                    >
                      <Option value="PENDING">Chờ xác nhận</Option>
                      <Option value="CONFIRMED">Đã xác nhận</Option>
                      <Option value="SHIPPING">Đang giao</Option>
                      <Option value="DELIVERED">Đã giao</Option>
                      <Option value="CANCELLED">Đã hủy</Option>
                    </Select>
                  </div>
                  <div className="form-actions">
                    <button className="cancel-button" onClick={handleCancelEdit}>
                      Hủy
                    </button>
                    <button className="save-button" onClick={handleSaveOrder}> {/* This triggers the save API call */}
                      Lưu
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="order-header">
                    <div className="order-info">
                      <span className="order-id">Đơn #{order._id}</span>
                      <span className="order-time">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div className="order-avatar">
                      <img src={Customer1} alt="avatar-customer1" />
                      <span>{order.customerName || 'Khách hàng'}</span>
                    </div>
                  </div>
                  <div className="order-items">
                    {order.items && order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <img
                          src={item.image || MiTron}
                          alt={item.name || 'Food item'}
                          className="item-image"
                        />
                        <div className="item-info">
                          <div className="item-details">
                            <span className="item-name">{item.name || 'Unnamed item'}</span>
                            <span className="item-quantity">
                              Số lượng: {item.quantity || 0}
                            </span>
                          </div>
                          <span className="item-price">
                            {(item.price || 0).toLocaleString()} VND
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="order-summary">
                      <div className="shipping-fee">
                        <span className="label">Phí vận chuyển:</span>
                        <span className="value">
                          {(order.shippingFee || 0).toLocaleString()} VND
                        </span>
                      </div>
                      <div className="total-amount">
                        <span className="label">
                          <strong>Tổng cộng:</strong>
                        </span>
                        <span className="value">
                          {(order.total || 0).toLocaleString()} VND
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="order-footer">
                    <div className="order-actions">
                      <button className="payment-method">
                        {order.paymentMethod || 'Chưa xác định'}
                      </button>
                      <button
                        className={`status-button ${
                          order.status === "DELIVERED"
                            ? "delivered"
                            : order.status === "SHIPPING"
                            ? "shipping"
                            : order.status === "CANCELLED"
                            ? "canceled"
                            : order.status === "CONFIRMED"
                            ? "confirmed"
                            : order.status === "PENDING"
                            ? "pending"
                            : ""
                        }`}
                      >
                        {order.status === "PENDING" && "Chờ xác nhận"}
                        {order.status === "CONFIRMED" && "Đã xác nhận"}
                        {order.status === "SHIPPING" && "Đang giao"}
                        {order.status === "DELIVERED" && "Đã giao"}
                        {order.status === "CANCELLED" && "Đã hủy"}
                        {!order.status && "Chưa xác định"}
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
