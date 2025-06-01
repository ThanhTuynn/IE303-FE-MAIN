import React, { useState, useEffect } from "react";
import { SearchOutlined, EditOutlined } from "@ant-design/icons";
import Topbar from "../../component/TopbarComponent/TopbarComponent";
import FooterComponent from "../../component/FooterComponent/FooterComponent";
import "./FoodManagementPage.scss";
import axios from "axios";

const categories = ["Bữa sáng tiện lợi", "Bữa trưa dinh dưỡng", "Snack bar", "Đồ uống tươi mát", "Combo tiện lợi"];

const FoodManagement = () => {
    const [activeCategory, setActiveCategory] = useState(categories[0]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [newMenuItem, setNewMenuItem] = useState({
        name: "",
        description: "",
        image: "",
        price: "",
        category: categories[0],
    });
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editMenuItem, setEditMenuItem] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch dữ liệu món ăn khi component mount
    useEffect(() => {
        fetchFoods();
    }, []);

    const fetchFoods = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            setError("No authentication token found. Please log in.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get("http://localhost:8080/api/foods", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFoods(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching foods:", err);
            setError("Failed to load food data. Please try again.");
            setFoods([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
    };

    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    // Lọc danh sách món ăn theo danh mục và từ khóa tìm kiếm
    const filteredMenuItems = foods.filter((item) => {
        const categoryMatch = activeCategory ? item.category === activeCategory : true;
        const searchMatch = searchKeyword ? item.name.toLowerCase().includes(searchKeyword.toLowerCase()) : true;
        return categoryMatch && searchMatch;
    });

    const handleAddButtonClick = () => {
        setIsAddModalVisible(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMenuItem({ ...newMenuItem, [name]: value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
                setNewMenuItem({ ...newMenuItem, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setEditMenuItem({ ...editMenuItem, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveNewItem = async () => {
        if (
            !newMenuItem.name ||
            !newMenuItem.description ||
            !newMenuItem.image ||
            !newMenuItem.price ||
            !newMenuItem.category
        ) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        const token = localStorage.getItem("jwtToken");
        const userData = localStorage.getItem("userData");

        console.log("🔐 Debug Authentication:");
        console.log("Token exists:", !!token);
        console.log("Token preview:", token ? token.substring(0, 50) + "..." : "null");
        console.log("User data:", userData ? JSON.parse(userData) : "null");

        if (!token) {
            alert("No authentication token found. Please log in as admin.");
            return;
        }

        try {
            const foodData = {
                name: newMenuItem.name,
                description: newMenuItem.description,
                image: newMenuItem.image,
                price: parseFloat(newMenuItem.price),
                category: newMenuItem.category,
                ingredients: [],
                available: true,
            };

            console.log("📤 Sending food data:", foodData);
            console.log("🔗 API URL:", "http://localhost:8080/api/foods");

            const response = await axios.post("http://localhost:8080/api/foods", foodData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const createdFood = response.data;
            setFoods([...foods, createdFood]);

            setNewMenuItem({
                name: "",
                description: "",
                image: "",
                price: "",
                category: categories[0],
            });
            setImagePreview(null);
            setIsAddModalVisible(false);
            alert("Món ăn đã được thêm thành công!");
        } catch (err) {
            console.error("❌ Full error object:", err);
            console.error("❌ Error response:", err.response);
            console.error("❌ Error status:", err.response?.status);
            console.error("❌ Error data:", err.response?.data);
            console.error("❌ Error headers:", err.response?.headers);

            if (err.response?.status === 403) {
                alert(
                    `❌ Lỗi 403 - Không có quyền truy cập: ${
                        err.response?.data?.message || "Bạn không có quyền admin để tạo món ăn mới"
                    }`
                );
            } else {
                alert(`❌ Lỗi tạo món ăn: ${err.response?.data?.message || err.message}`);
            }
        }
    };

    const handleCancelAdd = () => {
        setIsAddModalVisible(false);
        setNewMenuItem({
            name: "",
            description: "",
            image: "",
            price: "",
            category: categories[0],
        });
        setImagePreview(null);
    };

    const handleEditButtonClick = (item) => {
        setEditMenuItem(item);
        setIsEditModalVisible(true);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditMenuItem({ ...editMenuItem, [name]: value });
    };

    const handleSaveEditItem = async () => {
        if (
            !editMenuItem.name ||
            !editMenuItem.description ||
            !editMenuItem.image ||
            !editMenuItem.price ||
            !editMenuItem.category
        ) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        const token = localStorage.getItem("jwtToken");
        if (!token) {
            alert("No authentication token found. Please log in.");
            return;
        }

        try {
            // Prepare data for update, ensuring all required fields are included
            const updatedFoodData = {
                id: editMenuItem.id, // Ensure ID is included
                name: editMenuItem.name,
                description: editMenuItem.description,
                image: editMenuItem.image,
                price: parseFloat(editMenuItem.price),
                category: editMenuItem.category,
                ingredients: editMenuItem.ingredients || [], // Include ingredients, default to empty array if not present
                available: editMenuItem.available !== undefined ? editMenuItem.available : true, // Include available, default to true if not present
            };

            // Log the data being sent for debugging
            console.log("Sending update request for food ID:", editMenuItem.id);
            console.log("Update data:", updatedFoodData);

            const response = await axios.patch(`http://localhost:8080/api/foods/${editMenuItem.id}`, updatedFoodData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const updatedFood = response.data;
            setFoods(foods.map((food) => (food.id === updatedFood.id ? updatedFood : food)));

            setIsEditModalVisible(false);
            setEditMenuItem(null);
            alert("Món ăn đã được cập nhật thành công!");
        } catch (err) {
            console.error("Error updating food item:", err.response ? err.response.data : err.message);
            alert("Failed to update food item. Please try again.");
        }
    };

    const handleCancelEdit = () => {
        setIsEditModalVisible(false);
        setEditMenuItem(null);
    };

    if (loading) {
        return (
            <div className="food-container">
                <Topbar title="QUẢN LÝ MÓN ĂN" />
                <div className="main-content">
                    <p>Đang tải món ăn...</p>
                </div>
                <FooterComponent />
            </div>
        );
    }

    if (error) {
        return (
            <div className="food-container">
                <Topbar title="QUẢN LÝ MÓN ĂN" />
                <div className="main-content">
                    <p style={{ color: "red" }}>Lỗi: {error}</p>
                </div>
                <FooterComponent />
            </div>
        );
    }

    return (
        <div className="food-container">
            <Topbar title="QUẢN LÝ MÓN ĂN" />
            <div className="main-content">
                <div className="filter-bar">
                    <div className="filter-left">
                        <div className="filter-item">
                            <SearchOutlined />
                            <input
                                type="text"
                                placeholder="Tìm kiếm"
                                value={searchKeyword}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                    <div className="filter-right">
                        <button className="add-button" onClick={handleAddButtonClick}>
                            + Thêm
                        </button>
                    </div>
                </div>

                <div className="menu-container">
                    <div className="menu-categories">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`category ${activeCategory === category ? "active" : ""}`}
                                onClick={() => handleCategoryChange(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <div className="menu-grid">
                        {filteredMenuItems.map((item) => (
                            <div key={item.id} className="menu-item">
                                <img src={item.image} alt={item.name} className="item-image" />
                                <div className="item-info">
                                    <h3 className="item-name">{item.name}</h3>
                                    <div className="item-prices">
                                        <span className="original-price">{item.price.toLocaleString()} VND</span>
                                    </div>
                                    <p className="item-description">{item.description}</p>
                                </div>
                                <button className="edit-button" onClick={() => handleEditButtonClick(item)}>
                                    <EditOutlined /> Sửa món ăn
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {isEditModalVisible && (
                    <div className="edit-modal">
                        <div className="modal-content">
                            <h3 style={{ color: "#b71c1c", fontSize: "24px" }}>Sửa món ăn</h3>
                            <div className="form-group">
                                <label>Tên món ăn</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editMenuItem.name}
                                    onChange={handleEditInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Mô tả món ăn</label>
                                <textarea
                                    name="description"
                                    value={editMenuItem.description}
                                    onChange={handleEditInputChange}
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label>Hình ảnh</label>
                                <input type="file" accept="image/*" onChange={handleEditImageUpload} />
                                {editMenuItem.image && (
                                    <img src={editMenuItem.image} alt="Preview" className="image-preview" />
                                )}
                            </div>
                            <div className="form-group">
                                <label>Giá</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={editMenuItem.price}
                                    onChange={handleEditInputChange}
                                />
                            </div>
                            <div className="modal-actions">
                                <button onClick={handleCancelEdit}>Hủy</button>
                                <button onClick={handleSaveEditItem}>Lưu</button>
                            </div>
                        </div>
                    </div>
                )}

                {isAddModalVisible && (
                    <div className="add-modal">
                        <div className="modal-content">
                            <h3 style={{ color: "#b71c1c", fontSize: "24px" }}>Thêm món ăn mới</h3>
                            <div className="form-group">
                                <label>Tên món ăn</label>
                                <input type="text" name="name" value={newMenuItem.name} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>Mô tả món ăn</label>
                                <textarea
                                    name="description"
                                    value={newMenuItem.description}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label>Hình ảnh</label>
                                <input type="file" accept="image/*" onChange={handleImageUpload} />
                                {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
                            </div>
                            <div className="form-group">
                                <label>Giá</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={newMenuItem.price}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Phân loại</label>
                                <select name="category" value={newMenuItem.category} onChange={handleInputChange}>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button onClick={handleCancelAdd}>Hủy</button>
                                <button onClick={handleSaveNewItem}>Lưu</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <FooterComponent />
        </div>
    );
};

export default FoodManagement;
