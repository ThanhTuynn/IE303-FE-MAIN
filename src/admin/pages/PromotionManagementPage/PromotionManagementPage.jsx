import React, { useState, useEffect } from "react";
import { SearchOutlined, EditOutlined } from "@ant-design/icons";
import Topbar from "../../component/TopbarComponent/TopbarComponent";
import FooterComponent from "../../component/FooterComponent/FooterComponent";
import "./PromotionManagementPage.scss";
import axios from 'axios'; // Import axios

const categories = [
  "Happy hour",
  "Ưu đãi nóng hổi",
  "Càng đông càng hời",
  "Flash sale giờ trưa",
];

const PromotionManagement = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  // Initial state for new promotion item - will need adjustment for actual promotion structure
  const [newPromotionItem, setNewPromotionItem] = useState({
    name: "",
    description: "",
    type: "PERCENTAGE", // Default type
    value: "", // Changed from discountPercentage to value
    startDate: "",
    endDate: "",
    active: true,
    applicableFoodIds: [],
  });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  // Initial state for editing promotion item - will need adjustment
  const [editPromotionItem, setEditPromotionItem] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // State for fetched data
  const [foods, setFoods] = useState([]); // To store all foods
  const [promotions, setPromotions] = useState([]); // To store all promotions
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all foods and promotions when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Fetch Foods
      const foodsResponse = await axios.get('http://localhost:8080/api/foods', {
         headers: {
           'Authorization': `Bearer ${token}`
         }
      });
      console.log('Fetched foods:', foodsResponse.data);
      setFoods(foodsResponse.data);

      // Fetch Promotions
      const promotionsResponse = await axios.get('http://localhost:8080/api/promotions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Fetched promotions:', promotionsResponse.data);
      setPromotions(promotionsResponse.data); // Set the fetched promotions

      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError("Failed to load data. Please try again.");
      setFoods([]);
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category); // This will now likely filter promotions by type
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  // Filter promotions based on active category and search keyword
  const filteredPromotions = promotions.filter((promotion) => {
    console.log('Filtering promotion:', promotion);
    // Remove category filtering since promotions don't have categories
    const searchMatch = searchKeyword
      ? promotion.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (promotion.description && promotion.description.toLowerCase().includes(searchKeyword.toLowerCase()))
      : true;
    return searchMatch;
  });

  // Helper function to find foods by their IDs
  const findFoodsByIds = (foodIds) => {
      if (!foodIds || foodIds.length === 0) return [];
      // Ensure foodIds from promotion are handled correctly (they might be strings if stored that way)
      const foodIdStrings = foodIds.map(String);
      return foods.filter(food => foodIdStrings.includes(String(food.id)));
  };

  // The following functions need to be adapted for managing promotions, not menu items
  const handleAddButtonClick = () => {
    // Logic to open modal for adding a new promotion
    setIsAddModalVisible(true);
    // Initialize newPromotionItem here with default values
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
     setImagePreview(null); // Reset image preview for new item if applicable
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPromotionItem({ ...newPromotionItem, [name]: value });
  };

   // This image upload might be for a promotion banner, not food image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result); // Hiển thị ảnh xem trước
        // Decide where to store this image URL - maybe in newPromotionItem?
        // setNewPromotionItem({ ...newPromotionItem, image: reader.result }); // Example
      };
      reader.readAsDataURL(file);
    }
  };

  // This function needs to be adapted to save a NEW PROMOTION, possibly linked to selected foods
  const handleSaveNewItem = async () => {
    // Basic validation for promotion fields
    if (!newPromotionItem.name || !newPromotionItem.value || newPromotionItem.applicableFoodIds.length === 0) {
        alert("Vui lòng điền đầy đủ thông tin và chọn ít nhất một món ăn áp dụng!");
        return;
    }

     const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert("No authentication token found. Please log in.");
      return;
    }

    try {
        // Construct the promotion data object based on your backend's expected structure
        const promotionData = {
            name: newPromotionItem.name,
            description: newPromotionItem.description,
            type: newPromotionItem.type,
            value: parseFloat(newPromotionItem.value), // Ensure correct type
            startDate: newPromotionItem.startDate ? new Date(newPromotionItem.startDate).toISOString() : null,
            endDate: newPromotionItem.endDate ? new Date(newPromotionItem.endDate).toISOString() : null,
            active: newPromotionItem.active,
            applicableFoodIds: newPromotionItem.applicableFoodIds.map(String),
        };

        console.log('Sending promotion data:', promotionData);

        const response = await axios.post('http://localhost:8080/api/promotions', promotionData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
        });

        console.log('Promotion created:', response.data);
        fetchData();
        alert("Khuyến mãi đã được thêm thành công!");
        setIsAddModalVisible(false);
        setNewPromotionItem({
            name: "", description: "", type: "PERCENTAGE", value: "", startDate: "", endDate: "", active: true, applicableFoodIds: [],
        });
        setImagePreview(null);

    } catch (err) {
        console.error('Error adding promotion:', err.response ? err.response.data : err.message);
        alert("Failed to add promotion. Please try again.");
    }

  };

  const handleCancelAdd = () => {
    setIsAddModalVisible(false);
    setNewPromotionItem({ // Reset form
      name: "", description: "", type: "PERCENTAGE", value: "", startDate: "", endDate: "", active: true, applicableFoodIds: [],
    });
    setImagePreview(null);
  };

  // This function needs to be adapted for editing an existing PROMOTION
  const handleEditButtonClick = (promotion) => {
     // Logic to open modal for editing an existing promotion
     setEditPromotionItem(promotion); // Set the promotion to be edited
     setIsEditModalVisible(true);
      // Initialize form fields based on editPromotionItem
      // Example: setNewPromotionItem({ ...promotion, discountPercentage: String(promotion.discountPercentage) });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditPromotionItem({ ...editPromotionItem, [name]: value });
  };

   // This image upload might be for a promotion banner
  const handleEditImageUpload = (e) => {
      const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Decide where to store this image URL - maybe in editPromotionItem?
        // setEditPromotionItem({ ...editPromotionItem, image: reader.result }); // Example
      };
      reader.readAsDataURL(file);
    }
  };

  // This function needs to be adapted to save changes to an existing PROMOTION
  const handleSaveEditItem = async () => {
      // Basic validation
    if (!editPromotionItem.name || !editPromotionItem.value || editPromotionItem.applicableFoodIds.length === 0) {
        alert("Vui lòng điền đầy đủ thông tin và chọn ít nhất một món ăn áp dụng!");
        return;
    }

     const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert("No authentication token found. Please log in.");
      return;
    }

    try {
        // Construct the updated promotion data object
        const updatedPromotionData = {
            id: editPromotionItem.id,
            name: editPromotionItem.name,
            description: editPromotionItem.description,
            type: editPromotionItem.type,
            value: parseFloat(editPromotionItem.value),
            startDate: editPromotionItem.startDate ? new Date(editPromotionItem.startDate).toISOString() : null,
            endDate: editPromotionItem.endDate ? new Date(editPromotionItem.endDate).toISOString() : null,
            active: editPromotionItem.active,
            applicableFoodIds: editPromotionItem.applicableFoodIds.map(String),
        };

        console.log('Sending updated promotion data:', updatedPromotionData);

        const response = await axios.patch(`http://localhost:8080/api/promotions/${editPromotionItem.id}`, updatedPromotionData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
        });

        console.log('Promotion updated:', response.data);
        fetchData();
        alert("Khuyến mãi đã được cập nhật thành công!");
        setIsEditModalVisible(false);
        setEditPromotionItem(null);

    } catch (err) {
        console.error('Error updating promotion:', err.response ? err.response.data : err.message);
        alert("Failed to update promotion. Please try again.");
    }

  };

  const handleCancelEdit = () => {
    setIsEditModalVisible(false);
    setEditPromotionItem(null);
  };

  // Display loading or error state
  if (loading) {
    return (
      <div className="promotion-container">
        <Topbar title="QUẢN LÝ KHUYẾN MÃI" />
        <div className="main-content">
          <p>Đang tải dữ liệu...</p> {/* Updated loading message */}
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
          <p style={{ color: 'red' }}>Lỗi: {error}</p>
        </div>
        <FooterComponent />
      </div>
    );
  }

  return (
    <div className="promotion-container">
      <Topbar title="QUẢN LÝ KHUYẾN MÃI" />
      <div className="main-content">
        <div className="promotion-filter-bar">
          <div className="filter-left">
            <div className="filter-item">
              <SearchOutlined />
              <input
                type="text"
                placeholder="Tìm kiếm khuyến mãi..." // Updated placeholder
                value={searchKeyword}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="filter-right">
             <button className="add-button" onClick={handleAddButtonClick}>
              + Thêm Khuyến Mãi
            </button>
          </div>
        </div>

        <div className="promotion-menu-container">
           {/* Categories bar for filtering promotions */}
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
          {/* Display fetched and filtered promotions and their associated foods */}
          <div className="promotion-list">
            {filteredPromotions.length === 0 && searchKeyword === "" ? (
                <p>Chưa có khuyến mãi nào được tạo.</p>
            ) : filteredPromotions.length === 0 && searchKeyword !== "" ? (
                 <p>Không tìm thấy khuyến mãi nào phù hợp với từ khóa "{searchKeyword}".</p>
            ) : (
              filteredPromotions.map((promotion) => (
                 <div key={promotion.id} className="promotion-item">
                   <h3>{promotion.name}</h3>
                   <p>{promotion.description}</p>
                   {promotion.type === "PERCENTAGE" && (
                     <p>Giảm giá: {promotion.value}%</p>
                   )}
                   {promotion.type === "FIXED_AMOUNT" && (
                     <p>Giảm giá: {promotion.value.toLocaleString()} VND</p>
                   )}
                   {promotion.startDate && <p>Từ ngày: {new Date(promotion.startDate).toLocaleDateString()}</p>}
                   {promotion.endDate && <p>Đến ngày: {new Date(promotion.endDate).toLocaleDateString()}</p>}
                   <p>Trạng thái: {promotion.active ? "Đang áp dụng" : "Đã kết thúc"}</p>

                   <h4>Các món áp dụng:</h4>
                   <div className="applicable-foods-grid">
                       {findFoodsByIds(promotion.applicableFoodIds).map(food => (
                           <div key={food.id} className="food-item-small"> {/* This will be styled like .menu-item */}
                                <img src={food.image} alt={food.name} className="applicable-food-image" /> {/* Add specific class */}
                                <div className="item-info"> {/* Equivalent to .item-info in FoodManagementPage */}
                                  <h3 className="item-name">{food.name}</h3> {/* Use h3 for consistency */}
                                  <p className="original-price">{food.price.toLocaleString()} VND</p>
                                  {promotion.type === "PERCENTAGE" && (
                                    <p className="discount-price">
                                      {(food.price * (1 - promotion.value / 100)).toLocaleString()} VND
                                    </p>
                                  )}
                                  {promotion.type === "FIXED_AMOUNT" && (
                                    <p className="discount-price">
                                      {Math.max(0, food.price - promotion.value).toLocaleString()} VND
                                    </p>
                                  )}
                                </div>
                           </div>
                       ))}
                        {findFoodsByIds(promotion.applicableFoodIds).length === 0 && (
                            <p>Chưa có món ăn nào được áp dụng khuyến mãi này.</p>
                        )}
                   </div>

                    <div className="promotion-actions">
                         <button className="edit-button" onClick={() => handleEditButtonClick(promotion)}>
                             <EditOutlined /> Sửa Khuyến Mãi
                         </button>
                    </div>
                 </div>
              ))
            )}
          </div>
        </div>

        {/* Modal sửa khuyến mãi */}
        {isEditModalVisible && (
          <div className="edit-modal">
            <div className="modal-content">
              <h3 style={{ color: "#b71c1c", fontSize: "24px" }}>Sửa Khuyến Mãi</h3>
               <div className="form-group"><label>Tên Khuyến Mãi</label><input type="text" name="name" value={editPromotionItem?.name || ''} onChange={handleEditInputChange} /></div>
               <div className="form-group"><label>Mô tả</label><textarea name="description" value={editPromotionItem?.description || ''} onChange={handleEditInputChange}></textarea></div>
               <div className="form-group">
                 <label>Loại khuyến mãi</label>
                 <select name="type" value={editPromotionItem?.type || 'PERCENTAGE'} onChange={handleEditInputChange}>
                   <option value="PERCENTAGE">Giảm giá theo phần trăm</option>
                   <option value="FIXED_AMOUNT">Giảm giá cố định</option>
                 </select>
               </div>
               <div className="form-group">
                 <label>{editPromotionItem?.type === 'FIXED_AMOUNT' ? 'Số tiền giảm (VND)' : 'Phần trăm giảm giá (%)'}</label>
                 <input type="number" name="value" value={editPromotionItem?.value || ''} onChange={handleEditInputChange} />
               </div>
               <div className="form-group"><label>Ngày bắt đầu</label><input type="date" name="startDate" value={editPromotionItem?.startDate ? editPromotionItem.startDate.substring(0, 10) : ''} onChange={handleEditInputChange} /></div>
               <div className="form-group"><label>Ngày kết thúc</label><input type="date" name="endDate" value={editPromotionItem?.endDate ? editPromotionItem.endDate.substring(0, 10) : ''} onChange={handleEditInputChange} /></div>
               <div className="form-group">
                 <label>Trạng thái</label>
                 <select name="active" value={editPromotionItem?.active ? 'true' : 'false'} onChange={handleEditInputChange}>
                   <option value="true">Đang áp dụng</option>
                   <option value="false">Đã kết thúc</option>
                 </select>
               </div>
               {/* Applicable Foods selection needed here */}
               <div className="form-group">
                  <label>Chọn món ăn áp dụng khuyến mãi</label>
                  <div className="food-selection-grid"> {/* Add a grid for food selection */}
                    {foods.map(food => (
                      <div key={food.id} className="food-selection-item">
                        <input
                          type="checkbox"
                          id={`food-${food.id}-edit`}
                          value={food.id}
                          checked={editPromotionItem?.applicableFoodIds?.includes(String(food.id)) || false} // Check if ID is in the array
                          onChange={(e) => {
                            const foodId = String(e.target.value);
                            setEditPromotionItem(prevState => ({
                              ...prevState,
                              applicableFoodIds: e.target.checked
                                ? [...(prevState?.applicableFoodIds || []), foodId]
                                : (prevState?.applicableFoodIds || []).filter(id => id !== foodId)
                            }));
                          }}
                        />
                        <label htmlFor={`food-${food.id}-edit`}>
                           <img src={food.image} alt={food.name} className="food-selection-image" /> {/* Optional: show image */}
                          {food.name}
                        </label>
                      </div>
                    ))}
                     {foods.length === 0 && <p>Không tìm thấy món ăn nào để áp dụng khuyến mãi.</p>}
                  </div>
               </div>
              <div className="modal-actions">
                <button onClick={handleCancelEdit}>Hủy</button>
                <button onClick={handleSaveEditItem}>Lưu</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal thêm khuyến mãi */}
        {isAddModalVisible && (
          <div className="add-modal">
            <div className="modal-content">
              <h3 style={{ color: "#b71c1c", fontSize: "24px" }}>Thêm Khuyến Mãi Mới</h3>
               <div className="form-group"><label>Tên Khuyến Mãi</label><input type="text" name="name" value={newPromotionItem.name} onChange={handleInputChange} /></div>
               <div className="form-group"><label>Mô tả</label><textarea name="description" value={newPromotionItem.description} onChange={handleInputChange}></textarea></div>
               <div className="form-group">
                 <label>Loại khuyến mãi</label>
                 <select name="type" value={newPromotionItem.type} onChange={handleInputChange}>
                   <option value="PERCENTAGE">Giảm giá theo phần trăm</option>
                   <option value="FIXED_AMOUNT">Giảm giá cố định</option>
                 </select>
               </div>
               <div className="form-group">
                 <label>{newPromotionItem.type === 'FIXED_AMOUNT' ? 'Số tiền giảm (VND)' : 'Phần trăm giảm giá (%)'}</label>
                 <input type="number" name="value" value={newPromotionItem.value} onChange={handleInputChange} />
               </div>
               <div className="form-group"><label>Ngày bắt đầu</label><input type="date" name="startDate" value={newPromotionItem.startDate} onChange={handleInputChange} /></div>
               <div className="form-group"><label>Ngày kết thúc</label><input type="date" name="endDate" value={newPromotionItem.endDate} onChange={handleInputChange} /></div>
               {/* Applicable Foods selection needed here */}
               <div className="form-group">
                 <label>Chọn món ăn áp dụng khuyến mãi</label>
                 <div className="food-selection-grid"> {/* Add a grid for food selection */}
                   {foods.map(food => (
                     <div key={food.id} className="food-selection-item">
                       <input
                         type="checkbox"
                         id={`food-${food.id}-add`}
                         value={food.id}
                         checked={newPromotionItem.applicableFoodIds.includes(String(food.id))} // Check if ID is in the array
                         onChange={(e) => {
                           const foodId = String(e.target.value); // Ensure ID is string for consistency
                           setNewPromotionItem(prevState => ({
                             ...prevState,
                             applicableFoodIds: e.target.checked
                               ? [...prevState.applicableFoodIds, foodId]
                               : prevState.applicableFoodIds.filter(id => id !== foodId)
                           }));
                         }}
                       />
                       <label htmlFor={`food-${food.id}-add`}>
                          <img src={food.image} alt={food.name} className="food-selection-image" /> {/* Optional: show image */}
                         {food.name}
                       </label>
                     </div>
                   ))}
                   {foods.length === 0 && <p>Không tìm thấy món ăn nào để áp dụng khuyến mãi.</p>}
                 </div>
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
