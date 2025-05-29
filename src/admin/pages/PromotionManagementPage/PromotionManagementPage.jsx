import React, { useState } from "react";
import { SearchOutlined, EditOutlined } from "@ant-design/icons";
import Topbar from "../../component/TopbarComponent/TopbarComponent";
import FooterComponent from "../../component/FooterComponent/FooterComponent";
import "./PromotionManagementPage.scss";

const categories = [
  "Happy hour",
  "Ưu đãi nóng hổi",
  "Càng đông càng hời",
  "Flash sale giờ trưa",
];

const menuItemsByCategory = {
  "Happy hour": [
    {
      name: "Bánh mì trứng",
      price: 25000,
      discountPrice: 20000,
      description:
        "Gồm bánh mì giòn, trứng ốp la thơm ngon, kèm rau sống và đồ chua.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
    {
      name: "Bánh mì trứng",
      price: 25000,
      discountPrice: 20000,
      description:
        "Gồm bánh mì giòn, trứng ốp la thơm ngon, kèm rau sống và đồ chua.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
    {
      name: "Bánh mì trứng",
      price: 25000,
      discountPrice: 20000,
      description:
        "Gồm bánh mì giòn, trứng ốp la thơm ngon, kèm rau sống và đồ chua.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
    {
      name: "Bánh mì trứng",
      price: 25000,
      discountPrice: 20000,
      description:
        "Gồm bánh mì giòn, trứng ốp la thơm ngon, kèm rau sống và đồ chua.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
    {
      name: "Bánh mì trứng",
      price: 25000,
      discountPrice: 20000,
      description:
        "Gồm bánh mì giòn, trứng ốp la thơm ngon, kèm rau sống và đồ chua.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
    {
      name: "Bánh mì trứng",
      price: 25000,
      discountPrice: 20000,
      description:
        "Gồm bánh mì giòn, trứng ốp la thơm ngon, kèm rau sống và đồ chua.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
    {
      name: "Bánh mì trứng",
      price: 25000,
      discountPrice: 20000,
      description:
        "Gồm bánh mì giòn, trứng ốp la thơm ngon, kèm rau sống và đồ chua.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
    {
      name: "Bánh mì trứng",
      price: 25000,
      discountPrice: 20000,
      description:
        "Gồm bánh mì giòn, trứng ốp la thơm ngon, kèm rau sống và đồ chua.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
  ],
  "Ưu đãi nóng hổi": [
    {
      name: "Xôi thập cẩm",
      price: 35000,
      discountPrice: 20000,
      description:
        "Gồm xôi dẻo thơm, thịt gà xé mềm, kèm hành phi giòn và dưa chua.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
    {
      name: "Xôi thập cẩm",
      price: 35000,
      discountPrice: 20000,
      description:
        "Gồm xôi dẻo thơm, thịt gà xé mềm, kèm hành phi giòn và dưa chua.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
    {
      name: "Xôi thập cẩm",
      price: 35000,
      discountPrice: 20000,
      description:
        "Gồm xôi dẻo thơm, thịt gà xé mềm, kèm hành phi giòn và dưa chua.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
    {
      name: "Xôi thập cẩm",
      price: 35000,
      discountPrice: 20000,
      description:
        "Gồm xôi dẻo thơm, thịt gà xé mềm, kèm hành phi giòn và dưa chua.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
    {
      name: "Xôi thập cẩm",
      price: 35000,
      discountPrice: 20000,
      description:
        "Gồm xôi dẻo thơm, thịt gà xé mềm, kèm hành phi giòn và dưa chua.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
    {
      name: "Xôi thập cẩm",
      price: 35000,
      discountPrice: 20000,
      description:
        "Gồm xôi dẻo thơm, thịt gà xé mềm, kèm hành phi giòn và dưa chua.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
    {
      name: "Xôi thập cẩm",
      price: 35000,
      discountPrice: 20000,
      description:
        "Gồm xôi dẻo thơm, thịt gà xé mềm, kèm hành phi giòn và dưa chua.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
  ],
  "Càng đông càng hời": [
    {
      name: "Phở bò",
      price: 40000,
      discountPrice: 30000,
      description:
        "Phở bò thơm ngon với nước dùng đậm đà, thịt bò mềm và rau thơm.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
    {
      name: "Phở bò",
      price: 40000,
      discountPrice: 30000,
      description:
        "Phở bò thơm ngon với nước dùng đậm đà, thịt bò mềm và rau thơm.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
    {
      name: "Phở bò",
      price: 40000,
      discountPrice: 30000,
      description:
        "Phở bò thơm ngon với nước dùng đậm đà, thịt bò mềm và rau thơm.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
    {
      name: "Phở bò",
      price: 40000,
      discountPrice: 30000,
      description:
        "Phở bò thơm ngon với nước dùng đậm đà, thịt bò mềm và rau thơm.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
    {
      name: "Phở bò",
      price: 40000,
      discountPrice: 30000,
      description:
        "Phở bò thơm ngon với nước dùng đậm đà, thịt bò mềm và rau thơm.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
  ],
  "Flash sale giờ trưa": [
    {
      name: "Bánh mì trứng",
      price: 25000,
      discountPrice: 20000,
      description:
        "Gồm bánh mì giòn, trứng ốp la thơm ngon, kèm rau sống và đồ chua.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
    {
      name: "Bánh mì trứng",
      price: 25000,
      discountPrice: 20000,
      description:
        "Gồm bánh mì giòn, trứng ốp la thơm ngon, kèm rau sống và đồ chua.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
    {
      name: "Bánh mì trứng",
      price: 25000,
      discountPrice: 20000,
      description:
        "Gồm bánh mì giòn, trứng ốp la thơm ngon, kèm rau sống và đồ chua.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
    {
      name: "Bánh mì trứng",
      price: 25000,
      discountPrice: 20000,
      description:
        "Gồm bánh mì giòn, trứng ốp la thơm ngon, kèm rau sống và đồ chua.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
    {
      name: "Bánh mì trứng",
      price: 25000,
      discountPrice: 20000,
      description:
        "Gồm bánh mì giòn, trứng ốp la thơm ngon, kèm rau sống và đồ chua.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
    {
      name: "Bánh mì trứng",
      price: 25000,
      discountPrice: 20000,
      description:
        "Gồm bánh mì giòn, trứng ốp la thơm ngon, kèm rau sống và đồ chua.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
    {
      name: "Bánh mì trứng",
      price: 25000,
      discountPrice: 20000,
      description:
        "Gồm bánh mì giòn, trứng ốp la thơm ngon, kèm rau sống và đồ chua.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
    {
      name: "Bánh mì trứng",
      price: 25000,
      discountPrice: 20000,
      description:
        "Gồm bánh mì giòn, trứng ốp la thơm ngon, kèm rau sống và đồ chua.",
      image:
        "https://i.ex-cdn.com/vntravellive.com/files/news/2023/05/15/luu-ngay-5-quan-banh-mi-ngon-nen-thu-tai-sai-gon-151953.jpg",
    },
  ],
};

const PromotionManagement = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({
    id: "",
    name: "",
    description: "",
    image: "",
    price: "",
    discountPrice: "",
    category: categories[0],
  });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editMenuItem, setEditMenuItem] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const filteredMenuItems =
    menuItemsByCategory[activeCategory]?.filter((item) =>
      item.name.toLowerCase().includes(searchKeyword.toLowerCase())
    ) || [];

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
        setImagePreview(reader.result); // Hiển thị ảnh xem trước
        setNewMenuItem({ ...newMenuItem, image: reader.result }); // Lưu URL ảnh vào state
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditMenuItem({ ...editMenuItem, image: reader.result }); // Cập nhật hình ảnh trong state
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveNewItem = () => {
    if (
      !newMenuItem.id ||
      !newMenuItem.name ||
      !newMenuItem.description ||
      !newMenuItem.image ||
      !newMenuItem.price ||
      !newMenuItem.discountPrice
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Thêm món ăn mới vào danh mục tương ứng
    menuItemsByCategory[newMenuItem.category].push({
      id: newMenuItem.id,
      name: newMenuItem.name,
      description: newMenuItem.description,
      image: newMenuItem.image,
      price: parseInt(newMenuItem.price),
      discountPrice: parseInt(newMenuItem.discountPrice),
    });

    // Đặt lại form và đóng modal
    setNewMenuItem({
      id: "",
      name: "",
      description: "",
      image: "",
      price: "",
      discountPrice: "",
      category: categories[0],
    });
    setImagePreview(null);
    setIsAddModalVisible(false);
    alert("Món ăn đã được thêm thành công!");
  };

  const handleCancelAdd = () => {
    setIsAddModalVisible(false);
    setNewMenuItem({
      id: "",
      name: "",
      description: "",
      image: "",
      price: "",
      discountPrice: "",
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

  const handleSaveEditItem = () => {
    if (
      !editMenuItem.name ||
      !editMenuItem.description ||
      !editMenuItem.image ||
      !editMenuItem.price ||
      !editMenuItem.discountPrice
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Cập nhật món ăn trong danh sách
    const updatedItems = menuItemsByCategory[activeCategory].map((item) =>
      item.id === editMenuItem.id ? editMenuItem : item
    );
    menuItemsByCategory[activeCategory] = updatedItems;

    setIsEditModalVisible(false);
    setEditMenuItem(null);
    alert("Món ăn đã được cập nhật thành công!");
  };

  const handleCancelEdit = () => {
    setIsEditModalVisible(false);
    setEditMenuItem(null);
  };

  return (
    <div className="promotion-container">
      <Topbar title="QUẢN LÝ KHUYẾN MÃI" />
      <div className="main-content">
        {/* Thanh tìm kiếm và bộ lọc */}
        <div className="promotion-filter-bar">
          {/* Phần bên trái */}
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

          {/* Phần bên phải */}
          <div className="filter-right">
            <button className="add-button" onClick={handleAddButtonClick}>
              + Thêm
            </button>
          </div>
        </div>

        <div className="promotion-menu-container">
          <div className="promotion-menu-categories">
            {categories.map((category) => (
              <button
                key={category}
                className={`category ${
                  activeCategory === category ? "active" : ""
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="promotion-menu-grid">
            {menuItemsByCategory[activeCategory].map((item, index) => (
              <div key={index} className="promotion-menu-item">
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-info">
                  <h3 className="item-name">{item.name}</h3>
                  <div className="item-prices">
                    <span className="discount-price">
                      {item.discountPrice.toLocaleString()} VND
                    </span>
                    <span className="original-price">
                      {item.price.toLocaleString()} VND
                    </span>
                  </div>
                  <p className="item-description">{item.description}</p>
                </div>
                <button
                  className="edit-button"
                  onClick={() => handleEditButtonClick(item)}
                >
                  <EditOutlined /> Sửa món ăn
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Modal sửa món ăn */}
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
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageUpload}
                />
                {editMenuItem.image && (
                  <img
                    src={editMenuItem.image}
                    alt="Preview"
                    className="image-preview"
                  />
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
              <div className="form-group">
                <label>Giá khuyến mãi</label>
                <input
                  type="number"
                  name="discountPrice"
                  value={editMenuItem.discountPrice}
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

        {/* Modal thêm món ăn */}
        {isAddModalVisible && (
          <div className="add-modal">
            <div className="modal-content">
              <h3 style={{ color: "#b71c1c", fontSize: "24px" }}>
                Thêm khuyến mãi mới
              </h3>
              <div className="form-group">
                <label>Mã số món ăn</label>
                <input
                  type="text"
                  name="id"
                  value={newMenuItem.id}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Tên món ăn</label>
                <input
                  type="text"
                  name="name"
                  value={newMenuItem.name}
                  onChange={handleInputChange}
                />
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
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                )}
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
                <label>Giá khuyến mãi</label>
                <input
                  type="number"
                  name="discountPrice"
                  value={newMenuItem.discountPrice}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Phân loại</label>
                <select
                  name="category"
                  value={newMenuItem.category}
                  onChange={handleInputChange}
                >
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

export default PromotionManagement;
