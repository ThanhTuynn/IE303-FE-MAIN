import React, { useState, useEffect } from 'react';
import {
  FaBreadSlice,
  FaUtensils,
  FaConciergeBell,
  FaDrumstickBite,
  FaHamburger,
  FaCoffee,
  FaSearch,
  FaHeart
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

const Promotions = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState([]); // State to store fetched promotions
  const [foods, setFoods] = useState([]); // State to store all fetched food data
  const [promotionalFoods, setPromotionalFoods] = useState({}); // State to store foods grouped by promotion
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track any errors
  const [quantities, setQuantities] = useState({}); // Use object to store quantities by food ID
  const [search, setSearch] = useState('');
  const [userId, setUserId] = useState(null); // State to store the user ID

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const userData = localStorage.getItem('userData');

    if (!token || !userData) {
      alert("Please log in to view promotions and add items to your cart.");
      navigate('/login');
      return;
    }

     if (userData) {
            try {
                const user = JSON.parse(userData);
                setUserId(user.id); // Assuming user ID is stored as 'id'
            } catch (e) {
                console.error("Failed to parse user data from localStorage:", e);
                 alert("Error retrieving user data. Please log in again.");
                 navigate('/login');
                 return;
            }
        }

    // Fetch promotions and food data from the backend
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching promotions...");
        // Fetch promotions
        const promotionsResponse = await axios.get('http://localhost:8080/api/promotions', {
             headers: {
                'Authorization': `Bearer ${token}` // Include the JWT token
              }
        });
        console.log("Promotions response:", promotionsResponse.data);
        setPromotions(promotionsResponse.data);

        console.log("Fetching foods...");
        // Fetch all foods
        const foodsResponse = await axios.get('http://localhost:8080/api/foods');
        const allFoods = foodsResponse.data;
        console.log("Foods response:", allFoods);
        setFoods(allFoods);

        // Group foods by promotion
        const groupedFoods = {};
        promotionsResponse.data.forEach(promotion => {
            console.log("Processing promotion:", promotion);
            const applicableFoods = allFoods.filter(food =>
                promotion.applicableFoodIds && promotion.applicableFoodIds.includes(food.id.toString())
            );
            console.log("Applicable foods for promotion:", applicableFoods);
            if (applicableFoods.length > 0) {
                 groupedFoods[promotion.name] = {
                     icon: getCategoryIcon(promotion.name),
                     items: applicableFoods.map(food => ({ ...food, promotionDetails: promotion }))
                 };
            }
        });
        console.log("Grouped foods:", groupedFoods);
        setPromotionalFoods(groupedFoods);

        // Initialize quantities state based on fetched foods
        const initialQuantities = {};
        allFoods.forEach(food => {
            initialQuantities[food.id] = 0;
        });
        setQuantities(initialQuantities);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        console.error("Error details:", err.response?.data);
        setError(err);
        setLoading(false);
        alert("Failed to fetch promotions or food data. Please check console for details.");
      }
    };

     if (userId) { // Only fetch if userId is available
       console.log("User ID available, fetching data...");
       fetchData();
     } else {
       console.log("No user ID available, skipping data fetch");
     }

  }, [userId, navigate]); // Rerun effect if userId or navigate changes

  const handleChange = (foodId, delta) => {
    setQuantities(prev => {
      const updated = { ...prev };
      updated[foodId] = Math.max(0, (updated[foodId] || 0) + delta); // Allow quantity to be 0
      return updated;
    });
  };

  const handleAddToCart = async (food) => {
      const quantity = quantities[food.id];
      const token = localStorage.getItem('jwtToken'); // Get JWT token from localStorage

      if (!token) {
          alert("Please log in to add items to your cart.");
          navigate('/login');
          return; // Stop if not logged in
      }

      if (quantity > 0 && userId) {
          try {
              // Calculate the price to add to cart, considering promotion
              const priceToAddToCart = food.promotionDetails
                  ? food.price * (1 - food.promotionDetails.value / 100)
                  : food.price;

              const itemToAdd = {
                  foodId: food.id,
                  name: food.name,
                  price: priceToAddToCart, // Use the calculated price
                  quantity: quantity,
                  imageUrl: food.image
              };

              // Make the API call to add item to cart with Authorization header
              const response = await axios.post(
                  `http://localhost:8080/api/carts/${userId}/items`,
                  itemToAdd,
                  {
                      headers: {
                          'Authorization': `Bearer ${token}` // Include the JWT token
                      }
                  }
              );
              console.log("Item added to cart:", response.data);
              alert(`Đã thêm ${quantity} ${food.name} vào giỏ hàng!`);

              // Optionally reset the quantity counter after adding to cart
              setQuantities(prev => ({ ...prev, [food.id]: 0 }));

          } catch (err) {
              console.error("Error adding item to cart:", err);
              alert("Failed to add item to cart.");
          }
      } else if (quantity === 0) {
          alert("Please select a quantity greater than 0.");
      }
  };

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

   const getCategoryIcon = (categoryName) => {
    // Map backend categories/promotion names to your existing icons
    const icons = {
        'BÁNH MÌ': <FaBreadSlice className="text-red-600 mr-2" />,
        'MÌ': <FaUtensils className="text-red-600 mr-2" />,
        'XÔI': <FaConciergeBell className="text-red-600 mr-2" />,
        'CƠM': <FaDrumstickBite className="text-red-600 mr-2" />,
        'ĐỒ ĂN VẶT': <FaHamburger className="text-red-600 mr-2" />,
        'ĐỒ UỐNG': <FaCoffee className="text-red-600 mr-2" />,
        // Add more mappings for specific promotion names if needed
        'MÓN MỚI - GIÁ HỜI': <FaHeart className="text-red-600 mr-2"/>, // Example mapping for a promotion name
        'COMBO 1 NGƯỜI': <FaUtensils className="text-red-600 mr-2"/>,
        'COMBO CẶP ĐÔI': <FaConciergeBell className="text-red-600 mr-2"/>,
        'CÀNG ĐÔNG CÀNG DZUI': <FaDrumstickBite className="text-red-600 mr-2"/>
    };
    return icons[categoryName] || <FaUtensils className="text-red-600 mr-2" />; // Default icon
};

  if (loading) {
    return <div className="text-center py-8">Loading promotions...</div>; // Loading indicator
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error loading promotions: {error.message}</div>; // Error message
  }

  return (
    <div className="bg-white text-black font-kanit px-4 md:px-8 lg:px-16 py-10 zoom-75">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-red-600">DEAL CỰC CHẤT, <span className="text-black">NHẤT KHÁCH HÀNG</span></h1>
        <p className="text-gray-700 mt-2 max-w-3xl mx-auto">
        Chào đón bạn với những ưu đãi siêu ngọt ngào mà chỉ UniFoodie mới có! 🎉 Đặt hàng thả ga, nhận ngay giảm giá cực kỳ hấp dẫn với tốc độ giao hàng ánh sáng ✨✨
        </p>
        <div className="mt-6 max-w-lg mx-auto relative">
          <input
            type="text"
            className="w-full py-3 pl-5 pr-12 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Tìm món bạn yêu thích..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-600 hover:text-red-800">
            <FaSearch size={18} />
          </button>
        </div>
      </div>

      {search.trim() ? (
        <section className="mb-12">
          <h2 className="text-2xl md:text-1xl font-bold mb-6 flex items-center">
            <FaSearch className="text-red-600 mr-2" />
            <span className="text-red-600">Kết quả tìm kiếm</span>
          </h2>
          {filteredFoods.length === 0 ? (
            <p className="text-gray-600">Không tìm thấy món nào phù hợp.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFoods.map((food) => (
                <div
                  key={food.id}
                  className="border rounded-xl shadow p-4 bg-white flex flex-col justify-between min-h-[400px]"
                >
                  <img src={food.image} alt={food.name} className="w-full h-48 object-cover rounded-md mb-3" />
                  <h3 className="font-semibold text-lg">{food.name}</h3>
                  {food.promotionDetails ? (
                      <div className="flex items-center mt-1">
                          {/* Giá gốc gạch ngang */}
                          <span className="text-gray-500 text-sm line-through mr-2">{food.price.toLocaleString('vi-VN')}đ</span>
                          {/* Giá sau khuyến mãi */}
                          <span className="text-red-600 font-bold">{(food.price * (1 - food.promotionDetails.value / 100)).toLocaleString('vi-VN')}đ</span>
                      </div>
                  ) : (
                      <p className="text-red-600 font-bold mt-1">{food.price.toLocaleString('vi-VN')}đ</p>
                  )}
                  {/* Display promotion dates */}
                  {food.promotionDetails && food.promotionDetails.startDate && food.promotionDetails.endDate && (
                      <p className="text-xs text-gray-500 mt-1 mb-8">{`Áp dụng từ ${new Date(food.promotionDetails.startDate).toLocaleDateString()} đến ${new Date(food.promotionDetails.endDate).toLocaleDateString()}`}</p>
                  )}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-4 overflow-hidden">{food.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border rounded px-2 py-1">
                      <button onClick={() => handleChange(food.id, -1)} className="px-2 text-xl">−</button>
                      <span className="px-3">{quantities[food.id] || 0}</span>
                      <button onClick={() => handleChange(food.id, 1)} className="px-2 text-xl">+</button>
                    </div>
                    <button
                      disabled={(quantities[food.id] || 0) === 0 || !userId}
                      onClick={() => handleAddToCart(food)}
                      className={`text-sm px-4 py-1 rounded transition duration-300 ${
                        (quantities[food.id] || 0) === 0 || !userId
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        Object.entries(promotionalFoods).map(([promotionName, { icon, items }]) => (
          <section key={promotionName} className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 flex items-center">
              {icon}
              <span className="text-red-600">{promotionName}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((food) => (
                <div
                  key={food.id}
                  className="border rounded-xl shadow p-4 bg-white flex flex-col justify-between min-h-[400px]"
                >
                  <img src={food.image} alt={food.name} className="w-full h-48 object-cover rounded-md mb-3" />
                  <h3 className="font-semibold text-lg">{food.name}</h3>
                  {food.promotionDetails ? (
                      <div className="flex items-center mt-1">
                          {/* Giá gốc gạch ngang */}
                          <span className="text-gray-500 text-sm line-through mr-2">{food.price.toLocaleString('vi-VN')}đ</span>
                          {/* Giá sau khuyến mãi */}
                          <span className="text-red-600 font-bold">{(food.price * (1 - food.promotionDetails.value / 100)).toLocaleString('vi-VN')}đ</span>
                      </div>
                  ) : (
                      <p className="text-red-600 font-bold mt-1">{food.price.toLocaleString('vi-VN')}đ</p>
                  )}
                  {/* Display promotion dates */}
                  {food.promotionDetails && food.promotionDetails.startDate && food.promotionDetails.endDate && (
                      <p className="text-xs text-gray-500 mt-1">{`Áp dụng từ ${new Date(food.promotionDetails.startDate).toLocaleDateString()} đến ${new Date(food.promotionDetails.endDate).toLocaleDateString()}`}</p>
                  )}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-4 overflow-hidden">{food.description}</p>
                   {/* Display promotion details if available */}
                   {food.promotionDetails && (
                       <p className="text-sm text-green-600 font-bold mt-1">{`Giảm ${food.promotionDetails.value}%`}</p>
                   )}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border rounded px-2 py-1">
                      <button onClick={() => handleChange(food.id, -1)} className="px-2 text-xl">−</button>
                      <span className="px-3">{quantities[food.id] || 0}</span>
                      <button onClick={() => handleChange(food.id, 1)} className="px-2 text-xl">+</button>
                    </div>
                    <button
                       disabled={(quantities[food.id] || 0) === 0 || !userId}
                       onClick={() => handleAddToCart(food)} // Pass the food object
                       className={`text-sm px-4 py-1 rounded transition duration-300 ${
                         (quantities[food.id] || 0) === 0 || !userId
                           ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                           : 'bg-red-600 text-white hover:bg-red-700'
                       }`}
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
};

export default Promotions;