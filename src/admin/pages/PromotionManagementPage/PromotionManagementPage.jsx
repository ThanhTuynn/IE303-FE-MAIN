import React, { useState, useEffect } from "react";
import { SearchOutlined, EditOutlined, DeleteOutlined, TagsOutlined, CalendarOutlined } from "@ant-design/icons";
import Topbar from "../../component/TopbarComponent/TopbarComponent";
import FooterComponent from "../../component/FooterComponent/FooterComponent";
import "./PromotionManagementPage.scss";
import axios from "axios";

const promotionTypes = ["Tất cả", "Giảm theo phần trăm", "Giảm cố định"];

const PromotionManagement = () => {
    const [activeType, setActiveType] = useState("Tất cả");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [newPromotionItem, setNewPromotionItem] = useState({
        name: "",
        description: "",
        type: "PERCENTAGE",
        value: "",
        startDate: "",
        endDate: "",
        active: true,
        applicableFoodIds: [],
    });
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editPromotionItem, setEditPromotionItem] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [promotionToDelete, setPromotionToDelete] = useState(null);

    // State for fetched data
    const [foods, setFoods] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            setError("No authentication token found. Please log in.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            // Fetch Foods
            const foodsResponse = await axios.get("http://localhost:8080/api/foods", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFoods(foodsResponse.data);

            // Fetch Promotions
            const promotionsResponse = await axios.get("http://localhost:8080/api/promotions", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPromotions(promotionsResponse.data);
            setError(null);
        } catch (err) {
            setError("Failed to load data. Please try again.");
            setFoods([]);
            setPromotions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTypeChange = (type) => {
        setActiveType(type);
    };

    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    // Filter promotions based on type and search keyword
    const filteredPromotions = promotions.filter((promotion) => {
        const typeMatch =
            activeType === "Tất cả" ||
            (activeType === "Giảm theo phần trăm" && promotion.type === "PERCENTAGE") ||
            (activeType === "Giảm cố định" && promotion.type === "FIXED_AMOUNT");

        const searchMatch = searchKeyword
            ? promotion.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
              (promotion.description && promotion.description.toLowerCase().includes(searchKeyword.toLowerCase()))
            : true;
        return typeMatch && searchMatch;
    });

    const findFoodsByIds = (foodIds) => {
        if (!foodIds || foodIds.length === 0) return [];
        const foodIdStrings = foodIds.map(String);
        return foods.filter((food) => foodIdStrings.includes(String(food.id)));
    };

    const handleAddButtonClick = () => {
        setIsAddModalVisible(true);
        setNewPromotionItem({
            name: "",
            description: "",
            type: "PERCENTAGE",
            value: "",
            startDate: "",
            endDate: "",
            active: true,
            applicableFoodIds: [],
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPromotionItem({ ...newPromotionItem, [name]: value });
    };

    const handleFoodSelection = (foodId, isSelected) => {
        const updatedIds = isSelected
            ? [...newPromotionItem.applicableFoodIds, foodId]
            : newPromotionItem.applicableFoodIds.filter((id) => id !== foodId);
        setNewPromotionItem({ ...newPromotionItem, applicableFoodIds: updatedIds });
    };

    const handleEditFoodSelection = (foodId, isSelected) => {
        const updatedIds = isSelected
            ? [...editPromotionItem.applicableFoodIds, foodId]
            : editPromotionItem.applicableFoodIds.filter((id) => id !== foodId);
        setEditPromotionItem({ ...editPromotionItem, applicableFoodIds: updatedIds });
    };

    const handleSaveNewItem = async () => {
        if (!newPromotionItem.name || !newPromotionItem.value || newPromotionItem.applicableFoodIds.length === 0) {
            alert("Vui lòng điền đầy đủ thông tin và chọn ít nhất một món ăn áp dụng!");
            return;
        }

        const token = localStorage.getItem("jwtToken");
        if (!token) {
            alert("No authentication token found. Please log in.");
            return;
        }

        try {
            const promotionData = {
                name: newPromotionItem.name,
                description: newPromotionItem.description,
                type: newPromotionItem.type,
                value: parseFloat(newPromotionItem.value),
                startDate: newPromotionItem.startDate ? new Date(newPromotionItem.startDate).toISOString() : null,
                endDate: newPromotionItem.endDate ? new Date(newPromotionItem.endDate).toISOString() : null,
                active: newPromotionItem.active,
                applicableFoodIds: newPromotionItem.applicableFoodIds.map(String),
            };

            await axios.post("http://localhost:8080/api/promotions", promotionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            fetchData();
            alert("Khuyến mãi đã được thêm thành công!");
            setIsAddModalVisible(false);
        } catch (err) {
            alert("Failed to add promotion. Please try again.");
        }
    };

    const handleCancelAdd = () => {
        setIsAddModalVisible(false);
    };

    const handleEditButtonClick = (promotion) => {
        setEditPromotionItem({ ...promotion });
        setIsEditModalVisible(true);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditPromotionItem({ ...editPromotionItem, [name]: value });
    };

    const handleSaveEditItem = async () => {
        if (!editPromotionItem.name || !editPromotionItem.value) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        const token = localStorage.getItem("jwtToken");
        if (!token) {
            alert("No authentication token found. Please log in.");
            return;
        }

        try {
            const promotionData = {
                name: editPromotionItem.name,
                description: editPromotionItem.description,
                type: editPromotionItem.type,
                value: parseFloat(editPromotionItem.value),
                startDate: editPromotionItem.startDate ? new Date(editPromotionItem.startDate).toISOString() : null,
                endDate: editPromotionItem.endDate ? new Date(editPromotionItem.endDate).toISOString() : null,
                active: editPromotionItem.active,
                applicableFoodIds: editPromotionItem.applicableFoodIds?.map(String) || [],
            };

            await axios.put(`http://localhost:8080/api/promotions/${editPromotionItem.id}`, promotionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            fetchData();
            alert("Khuyến mãi đã được cập nhật thành công!");
            setIsEditModalVisible(false);
        } catch (err) {
            alert("Failed to update promotion. Please try again.");
        }
    };

    const handleCancelEdit = () => {
        setIsEditModalVisible(false);
        setEditPromotionItem(null);
    };

    const handleDeleteButtonClick = (promotion) => {
        setPromotionToDelete(promotion);
        setIsDeleteModalVisible(true);
    };

    const handleCancelDelete = () => {
        setIsDeleteModalVisible(false);
        setPromotionToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!promotionToDelete) return;

        const token = localStorage.getItem("jwtToken");
        if (!token) {
            alert("No authentication token found. Please log in.");
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/api/promotions/${promotionToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            fetchData();
            alert("Khuyến mãi đã được xóa thành công!");
            setIsDeleteModalVisible(false);
            setPromotionToDelete(null);
        } catch (err) {
            alert("Failed to delete promotion. Please try again.");
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const calculateDiscountedPrice = (originalPrice, promotion) => {
        if (promotion.type === "PERCENTAGE") {
            return originalPrice * (1 - promotion.value / 100);
        } else {
            return Math.max(0, originalPrice - promotion.value);
        }
    };

    const getStatusBadge = (promotion) => {
        const now = new Date();
        const start = promotion.startDate ? new Date(promotion.startDate) : null;
        const end = promotion.endDate ? new Date(promotion.endDate) : null;

        if (!promotion.active) {
            return <span className="status-badge inactive">Đã tắt</span>;
        } else if (start && now < start) {
            return <span className="status-badge upcoming">Sắp diễn ra</span>;
        } else if (end && now > end) {
            return <span className="status-badge expired">Đã hết hạn</span>;
        } else {
            return <span className="status-badge active">Đang áp dụng</span>;
        }
    };

    if (loading) {
        return (
            <div className="promotion-container">
                <Topbar title="QUẢN LÝ KHUYẾN MÃI" />
                <div className="main-content">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Đang tải dữ liệu...</p>
                    </div>
                </div>
                <FooterComponent />
            </div>
        );
    }

    if (error) {
        return (
            <div className="promotion-container">
                <Topbar title="QUẢN LÝ KHUYẾN MÃI" />
                <div className="main-content">
                    <div className="error-container">
                        <p className="error-message">Lỗi: {error}</p>
                        <button onClick={fetchData} className="retry-button">
                            Thử lại
                        </button>
                    </div>
                </div>
                <FooterComponent />
            </div>
        );
    }

    return (
        <div className="promotion-container">
            <Topbar title="QUẢN LÝ KHUYẾN MÃI" />
            <div className="main-content">
                {/* Filter Bar */}
                <div className="filter-bar">
                    <div className="filter-left">
                        <div className="filter-item">
                            <SearchOutlined />
                            <input
                                type="text"
                                placeholder="Tìm kiếm khuyến mãi..."
                                value={searchKeyword}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                    <div className="filter-right">
                        <button className="add-button" onClick={handleAddButtonClick}>
                            <TagsOutlined /> Thêm Khuyến Mãi
                        </button>
                    </div>
                </div>

                {/* Promotion Container */}
                <div className="promotion-management-container">
                    {/* Type Categories */}
                    <div className="promotion-categories">
                        {promotionTypes.map((type) => (
                            <button
                                key={type}
                                className={`category ${activeType === type ? "active" : ""}`}
                                onClick={() => handleTypeChange(type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    {/* Promotions Grid */}
                    <div className="promotions-grid">
                        {filteredPromotions.length === 0 ? (
                            <div className="empty-state">
                                <TagsOutlined className="empty-icon" />
                                <p>
                                    {searchKeyword
                                        ? `Không tìm thấy khuyến mãi nào phù hợp với từ khóa "${searchKeyword}"`
                                        : "Chưa có khuyến mãi nào được tạo"}
                                </p>
                            </div>
                        ) : (
                            filteredPromotions.map((promotion) => (
                                <div key={promotion.id} className="promotion-card">
                                    <div className="promotion-header">
                                        <div className="promotion-title">
                                            <h3>{promotion.name}</h3>
                                            {getStatusBadge(promotion)}
                                        </div>
                                        <div className="promotion-actions">
                                            <button
                                                className="action-btn edit-btn"
                                                onClick={() => handleEditButtonClick(promotion)}
                                                title="Sửa khuyến mãi"
                                            >
                                                <EditOutlined />
                                            </button>
                                            <button
                                                className="action-btn delete-btn"
                                                onClick={() => handleDeleteButtonClick(promotion)}
                                                title="Xóa khuyến mãi"
                                            >
                                                <DeleteOutlined />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="promotion-info">
                                        <p className="promotion-description">{promotion.description}</p>

                                        <div className="promotion-details">
                                            <div className="detail-item">
                                                <TagsOutlined className="detail-icon" />
                                                <span>
                                                    {promotion.type === "PERCENTAGE"
                                                        ? `Giảm ${promotion.value}%`
                                                        : `Giảm ${formatPrice(promotion.value)}`}
                                                </span>
                                            </div>

                                            {promotion.startDate && (
                                                <div className="detail-item">
                                                    <CalendarOutlined className="detail-icon" />
                                                    <span>
                                                        {new Date(promotion.startDate).toLocaleDateString("vi-VN")}
                                                        {promotion.endDate &&
                                                            ` - ${new Date(promotion.endDate).toLocaleDateString(
                                                                "vi-VN"
                                                            )}`}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="applicable-foods">
                                        <h4>Món ăn áp dụng ({findFoodsByIds(promotion.applicableFoodIds).length})</h4>
                                        <div className="foods-grid">
                                            {findFoodsByIds(promotion.applicableFoodIds).map((food) => (
                                                <div key={food.id} className="food-item">
                                                    <img src={food.image} alt={food.name} className="food-image" />
                                                    <div className="food-info">
                                                        <p className="food-name">{food.name}</p>
                                                        <div className="price-info">
                                                            <span className="original-price">
                                                                {formatPrice(food.price)}
                                                            </span>
                                                            <span className="discounted-price">
                                                                {formatPrice(
                                                                    calculateDiscountedPrice(food.price, promotion)
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {findFoodsByIds(promotion.applicableFoodIds).length === 0 && (
                                                <p className="no-foods">Chưa có món ăn nào được áp dụng</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Add Modal */}
                {isAddModalVisible && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Thêm Khuyến Mãi Mới</h3>
                                <button className="close-btn" onClick={handleCancelAdd}>
                                    ×
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Tên khuyến mãi *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={newPromotionItem.name}
                                            onChange={handleInputChange}
                                            placeholder="VD: Flash Sale Cuối Tuần"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Mô tả</label>
                                    <textarea
                                        name="description"
                                        value={newPromotionItem.description}
                                        onChange={handleInputChange}
                                        placeholder="Mô tả chi tiết về khuyến mãi..."
                                        rows="3"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Loại khuyến mãi *</label>
                                        <select name="type" value={newPromotionItem.type} onChange={handleInputChange}>
                                            <option value="PERCENTAGE">Giảm theo phần trăm (%)</option>
                                            <option value="FIXED_AMOUNT">Giảm số tiền cố định (VND)</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            {newPromotionItem.type === "PERCENTAGE"
                                                ? "Phần trăm giảm (%)"
                                                : "Số tiền giảm (VND)"}
                                        </label>
                                        <input
                                            type="number"
                                            name="value"
                                            value={newPromotionItem.value}
                                            onChange={handleInputChange}
                                            placeholder={
                                                newPromotionItem.type === "PERCENTAGE" ? "VD: 20" : "VD: 50000"
                                            }
                                            min="0"
                                            max={newPromotionItem.type === "PERCENTAGE" ? "100" : undefined}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Ngày bắt đầu</label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={newPromotionItem.startDate}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Ngày kết thúc</label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={newPromotionItem.endDate}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Chọn món ăn áp dụng *</label>
                                    <div className="foods-selection">
                                        {foods.map((food) => (
                                            <div key={food.id} className="food-checkbox">
                                                <input
                                                    type="checkbox"
                                                    id={`food-${food.id}`}
                                                    checked={newPromotionItem.applicableFoodIds.includes(food.id)}
                                                    onChange={(e) => handleFoodSelection(food.id, e.target.checked)}
                                                />
                                                <label htmlFor={`food-${food.id}`} className="food-label">
                                                    <img src={food.image} alt={food.name} className="food-thumbnail" />
                                                    <div className="food-details">
                                                        <span className="food-name">{food.name}</span>
                                                        <span className="food-price">{formatPrice(food.price)}</span>
                                                    </div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="btn-secondary" onClick={handleCancelAdd}>
                                    Hủy
                                </button>
                                <button className="btn-primary" onClick={handleSaveNewItem}>
                                    Thêm Khuyến Mãi
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {isEditModalVisible && editPromotionItem && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Sửa Khuyến Mãi</h3>
                                <button className="close-btn" onClick={handleCancelEdit}>
                                    ×
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Tên khuyến mãi *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={editPromotionItem.name}
                                            onChange={handleEditInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Mô tả</label>
                                    <textarea
                                        name="description"
                                        value={editPromotionItem.description || ""}
                                        onChange={handleEditInputChange}
                                        rows="3"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Loại khuyến mãi *</label>
                                        <select
                                            name="type"
                                            value={editPromotionItem.type}
                                            onChange={handleEditInputChange}
                                        >
                                            <option value="PERCENTAGE">Giảm theo phần trăm (%)</option>
                                            <option value="FIXED_AMOUNT">Giảm số tiền cố định (VND)</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            {editPromotionItem.type === "PERCENTAGE"
                                                ? "Phần trăm giảm (%)"
                                                : "Số tiền giảm (VND)"}
                                        </label>
                                        <input
                                            type="number"
                                            name="value"
                                            value={editPromotionItem.value}
                                            onChange={handleEditInputChange}
                                            min="0"
                                            max={editPromotionItem.type === "PERCENTAGE" ? "100" : undefined}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Ngày bắt đầu</label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={
                                                editPromotionItem.startDate
                                                    ? editPromotionItem.startDate.substring(0, 10)
                                                    : ""
                                            }
                                            onChange={handleEditInputChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Ngày kết thúc</label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={
                                                editPromotionItem.endDate
                                                    ? editPromotionItem.endDate.substring(0, 10)
                                                    : ""
                                            }
                                            onChange={handleEditInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="form-checkbox">
                                        <input
                                            type="checkbox"
                                            id="active"
                                            name="active"
                                            checked={editPromotionItem.active}
                                            onChange={(e) =>
                                                setEditPromotionItem({ ...editPromotionItem, active: e.target.checked })
                                            }
                                        />
                                        <label htmlFor="active">Kích hoạt khuyến mãi</label>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Chọn món ăn áp dụng</label>
                                    <div className="foods-selection">
                                        {foods.map((food) => (
                                            <div key={food.id} className="food-checkbox">
                                                <input
                                                    type="checkbox"
                                                    id={`edit-food-${food.id}`}
                                                    checked={
                                                        editPromotionItem.applicableFoodIds?.includes(food.id) || false
                                                    }
                                                    onChange={(e) => handleEditFoodSelection(food.id, e.target.checked)}
                                                />
                                                <label htmlFor={`edit-food-${food.id}`} className="food-label">
                                                    <img src={food.image} alt={food.name} className="food-thumbnail" />
                                                    <div className="food-details">
                                                        <span className="food-name">{food.name}</span>
                                                        <span className="food-price">{formatPrice(food.price)}</span>
                                                    </div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="btn-secondary" onClick={handleCancelEdit}>
                                    Hủy
                                </button>
                                <button className="btn-primary" onClick={handleSaveEditItem}>
                                    Cập Nhật
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {isDeleteModalVisible && promotionToDelete && (
                    <div className="modal-overlay">
                        <div className="modal-content delete-modal">
                            <div className="modal-header">
                                <h3>Xác nhận xóa</h3>
                            </div>

                            <div className="modal-body">
                                <p>
                                    Bạn có chắc chắn muốn xóa khuyến mãi <strong>"{promotionToDelete.name}"</strong>?
                                </p>
                                <p className="warning-text">Hành động này không thể hoàn tác!</p>
                            </div>

                            <div className="modal-footer">
                                <button className="btn-secondary" onClick={handleCancelDelete}>
                                    Hủy
                                </button>
                                <button className="btn-danger" onClick={handleConfirmDelete}>
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <FooterComponent />
        </div>
    );
};

export default PromotionManagement;
