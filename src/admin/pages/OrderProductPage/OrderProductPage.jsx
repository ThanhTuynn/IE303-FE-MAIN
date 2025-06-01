import React, { useState, useEffect } from "react";
import DatePicker from "antd/es/date-picker";
import { Select, message } from "antd";
import { SearchOutlined, EditOutlined } from "@ant-design/icons";
import Topbar from "../../component/TopbarComponent/TopbarComponent";
import FooterComponent from "../../component/FooterComponent/FooterComponent";
import "./OrderProductPage.scss";

import axios from 'axios';

const { Option } = Select;

// Helper function to format date - Keep this here
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

// Helper function to get status color - Moved to top level
const getStatusColor = (status) => {
  switch (status) {
    case "DELIVERED":
      return "delivered";
    case "SHIPPING":
      return "shipping";
    case "CANCELLED":
      return "canceled";
    case "CONFIRMED":
      return "confirmed";
    case "PENDING":
      return "pending";
    default:
      return "";
  }
};

// Helper function to get status text - Moved to top level
const getStatusText = (status) => {
  switch (status) {
    case "PENDING":
      return "Chờ xác nhận";
    case "CONFIRMED":
      return "Đã xác nhận";
    case "SHIPPING":
      return "Đang giao";
    case "DELIVERED":
      return "Đã giao";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return "Chưa xác định";
  }
};

const OrderProductPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editedOrder, setEditedOrder] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [newOrder, setNewOrder] = useState({
    items: [],
    shippingFee: 0,
    totalAmount: 0,
    paymentMethod: "",
    status: "PENDING",
    userId: "",
    deliveryAddress: "",
    specialInstructions: "",
  });
  const [usersMap, setUsersMap] = useState({});
  const [loadingUsers, setLoadingUsers] = useState(false);

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
      
      console.log('Raw orders data from API:', response.data);
      
      const sortedOrders = response.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setOrders(sortedOrders);
      setFilteredOrders(sortedOrders);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      const errorMessage = err.response?.data?.message || "Failed to load orders. Please try again.";
      setError(errorMessage);
      message.error(errorMessage);
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...orders];
    
    if (selectedDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt).toLocaleDateString('vi-VN');
        return orderDate === selectedDate;
      });
    }
    
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter((order) => {
        return (
          order.id?.toLowerCase().includes(keyword) ||
          order.userId?.toLowerCase().includes(keyword) ||
          order.deliveryAddress?.toLowerCase().includes(keyword) ||
          order.paymentMethod?.toLowerCase().includes(keyword) ||
          order.status?.toLowerCase().includes(keyword) ||
          order.items?.some(item => item.name?.toLowerCase().includes(keyword))
        );
      });
    }
    
    setFilteredOrders(filtered);
  }, [orders, selectedDate, searchKeyword]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (orders.length === 0) return;

      setLoadingUsers(true);
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        console.error("No authentication token found. Cannot fetch user details.");
        setLoadingUsers(false);
        return;
      }

      const uniqueUserIds = [...new Set(orders.map(order => order.userId))];

      const usersData = {};
      for (const userId of uniqueUserIds) {
        if (!userId) continue;
        if (!usersMap[userId]) {
          try {
            const response = await axios.get(`http://localhost:8080/api/users/${userId}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            usersData[userId] = response.data;
          } catch (err) {
            console.error(`Error fetching user details for userId ${userId}:`, err);
            usersData[userId] = { username: 'Unknown User', profilePicture: '' };
          }
        }
      }

      setUsersMap(prevUsersMap => ({ ...prevUsersMap, ...usersData }));
      setLoadingUsers(false);
    };

    fetchUsers();
  }, [orders]);

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleEditOrder = (order) => {
    setEditingOrderId(order.id);
    setEditedOrder({ 
      ...order,
      items: order.items || [],
    });
  };

  const handleCancelEdit = () => {
    setEditingOrderId(null);
    setEditedOrder(null);
  };

  const handleStatusChange = (value) => {
    setEditedOrder(prevState => ({
      ...prevState,
      status: value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedOrder({ ...editedOrder, [name]: value });
  };

  const handleSaveOrder = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      message.error("No authentication token found. Please log in.");
      return;
    }

    if (!editedOrder || !editedOrder.id) {
      message.error("No order selected for editing.");
      return;
    }

     const updateData = {
        status: editedOrder.status
     };

    try {
      const response = await axios.put(
        `http://localhost:8080/api/orders/${editedOrder.id}/status`,
        null,
        {
          params: { status: editedOrder.status },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const updatedOrders = orders.map(order =>
        order.id === editedOrder.id ? response.data : order
      );
      setOrders(updatedOrders);
      
      message.success("Order updated successfully!");
      setEditingOrderId(null);
      setEditedOrder(null);
    } catch (err) {
      console.error('Error updating order:', err);
      const errorMessage = err.response?.data?.message || "Failed to update order. Please try again.";
      message.error(errorMessage);
    }
  };

  const handleAddButtonClick = () => {
    setIsAddModalVisible(true);
     setNewOrder({
      items: [],
      shippingFee: 0,
      totalAmount: 0,
      paymentMethod: "",
      status: "PENDING",
      userId: "",
      deliveryAddress: "",
      specialInstructions: "",
    });
  };

  const handleCancelAddModal = () => {
    setIsAddModalVisible(false);
     setNewOrder({
      items: [],
      shippingFee: 0,
      totalAmount: 0,
      paymentMethod: "",
      status: "PENDING",
      userId: "",
      deliveryAddress: "",
      specialInstructions: "",
    });
  };

  const handleNewOrderChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  const handleSaveNewOrder = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      message.error("No authentication token found. Please log in.");
      return;
    }
    
    if (!newOrder.userId || !newOrder.deliveryAddress || !newOrder.paymentMethod || newOrder.items.length === 0) {
         message.error("Vui lòng điền đầy đủ thông tin cần thiết và thêm ít nhất một món ăn.");
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

      const createdOrder = response.data;

      setOrders([createdOrder, ...orders]);
      if (selectedDate) {
         const filtered = [createdOrder, ...orders].filter((order) => {
            const orderDate = new Date(order.createdAt).toLocaleDateString('vi-VN');
            return orderDate === selectedDate;
         });
         setFilteredOrders(filtered);
      } else {
         setFilteredOrders([createdOrder, ...orders]);
      }

      setIsAddModalVisible(false);
      message.success("New order created successfully!");
      setNewOrder({
        items: [],
        shippingFee: 0,
        totalAmount: 0,
        paymentMethod: "",
        status: "PENDING",
        userId: "",
        deliveryAddress: "",
        specialInstructions: "",
      });
    } catch (err) {
      console.error('Error creating order:', err.response ? err.response.data : err.message);
      const errorMessage = err.response?.data?.message || "Failed to create order. Please try again.";
      message.error(errorMessage);
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
            <button className="add-button" onClick={handleAddButtonClick}>
              + Thêm
            </button>
          </div>
        </div>

        {/* Add Order Modal */}
        {isAddModalVisible && (
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
                <button className="cancel-button" onClick={handleCancelAddModal}>
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
          {filteredOrders.length === 0 ? (
            <p className="no-orders">Không tìm thấy đơn hàng nào.</p>
          ) : (
            filteredOrders.map((order, index) => (
              <div key={order.id} className="order-card">
                {editingOrderId === order.id ? (
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
                      <button className="save-button" onClick={handleSaveOrder}>
                        Lưu
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="order-header">
                      <div className="order-info">
                        <span className="order-id">Đơn #{index + 1}</span>
                        <span className="order-time">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                      <div className="order-avatar">
                        <img src={usersMap[order.userId]?.profilePicture || ''} alt="User Avatar" />
                        <span>{usersMap[order.userId]?.username || order.userId || 'Người dùng không xác định'}</span>
                      </div>
                    </div>
                    <div className="order-items">
                      {order.items && order.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <img
                            src={item.imageUrl || ''}
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
                      {order.items.length === 0 && <p>Không có món ăn nào trong đơn hàng này.</p>}
                    </div>
                    <div className="order-summary">
                      <div className="shipping-fee">
                        <span className="label">Phí vận chuyển: </span>
                        <span className="value">
                          {(order.shippingFee || 0).toLocaleString()} VND
                        </span>
                      </div>
                      <div className="total-amount">
                        <span className="label">
                          <strong>Tổng cộng: </strong>
                        </span>
                        <span className="value">
                          {(order.totalAmount || 0).toLocaleString()} VND
                        </span>
                      </div>
                      {order.specialInstructions && (
                        <div className="special-instructions">
                          <span className="value">{order.specialInstructions}</span>
                        </div>
                      )}
                    </div>
                    <div className="order-footer">
                      <div className="order-actions">
                        <button className="payment-method">
                          {order.paymentMethod || 'Chưa xác định'}
                        </button>
                        <button className={`status-button ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
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
            ))
          )}
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default OrderProductPage;
