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

const Menu = () => {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]); // State to store fetched food data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track any errors
  const [quantities, setQuantities] = useState({}); // Use object to store quantities by food ID
  const [search, setSearch] = useState('');
  const [userId, setUserId] = useState(null); // State to store the user ID
  const [favoriteFoodIds, setFavoriteFoodIds] = useState(new Set()); // State to store favorite food IDs

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const userData = localStorage.getItem('userData');

    if (!token || !userData) {
      // User is not logged in. We can still fetch and display foods,
      // but favorite and add-to-cart actions will require login.
      console.log("User not logged in.");
      setLoading(false); // Stop loading even if not logged in
      // Optionally, you might want to redirect or show a message here
    } else {
         try {
             const user = JSON.parse(userData);
             setUserId(user.id);
         } catch (e) {
             console.error("Failed to parse user data from localStorage:", e);
             // Handle error, maybe clear local storage and ask to login again
              alert("Error retrieving user data. Please log in again.");
              navigate('/login'); // Redirect to login on data parse error
              setLoading(false); // Stop loading on error
              return; // Exit useEffect if user data is invalid
         }

      // Fetch user's favorites after getting userId
      const fetchFavorites = async (id) => {
          try {
              const response = await axios.get(`http://localhost:8080/api/users/${id}/favourites`, {
                   headers: {
                      'Authorization': `Bearer ${token}`
                    }
              });
              // Assuming the response data is an array of favorite food objects
              const favoriteIds = new Set(response.data.map(food => food.id));
              setFavoriteFoodIds(favoriteIds);
          } catch (err) {
              console.error("Error fetching favorites:", err);
               // Handle error, but don't block food loading
          }
      };
       if (userId) { // Only fetch favorites if userId is available
           fetchFavorites(userId);
       }
    }

    // Fetch food data from the backend - this can happen regardless of login status
    const fetchFoods = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/foods');
        setFoods(response.data);

        const initialQuantities = {};
        response.data.forEach(food => {
            initialQuantities[food.id] = 0;
        });
        setQuantities(initialQuantities);
        setLoading(false); // Stop loading after foods are fetched
      } catch (err) {
        setError(err);
        setLoading(false);
        console.error("Error fetching foods:", err);
        alert("Failed to fetch food data."); // Alert user about the error
      }
    };

    fetchFoods();

  }, [userId, navigate]); // Rerun effect if userId or navigate changes

  const toggleFavourite = async (food) => {
       const token = localStorage.getItem('jwtToken');
       if (!token || !userId) {
            alert("Please log in to mark items as favourites.");
            navigate('/login');
            return;
       }

       // Add debug logging
       console.log("Token:", token);
       console.log("User ID:", userId);
       console.log("Food ID:", food.id);

       const isCurrentlyFavorite = favoriteFoodIds.has(food.id);

       try {
           if (isCurrentlyFavorite) {
               // Remove from favorites
               console.log("Attempting to remove from favorites...");
               await axios.delete(`http://localhost:8080/api/users/${userId}/favourites/${food.id}`, {
                    headers: {
                       'Authorization': `Bearer ${token}`
                     }
               });
               setFavoriteFoodIds(prev => {
                   const newState = new Set(prev);
                   newState.delete(food.id);
                   return newState;
               });
               alert("Đã xoá khỏi danh sách yêu thích!");
           } else {
               // Add to favorites
               console.log("Attempting to add to favorites...");
               await axios.post(`http://localhost:8080/api/users/${userId}/favourites`, 
                   { foodId: food.id }, 
                   {
                    headers: {
                       'Authorization': `Bearer ${token}`,
                       'Content-Type': 'application/json'
                     }
               });
               setFavoriteFoodIds(prev => new Set(prev).add(food.id));
               alert("Đã thêm vào danh sách yêu thích!");
           }
       } catch (err) {
           console.error("Error toggling favorite status:", err);
            alert("Failed to update favourite status.");
       }
   };

  const handleChange = (foodId, delta) => {
    setQuantities(prev => {
      const updated = { ...prev };
      updated[foodId] = Math.max(0, (updated[foodId] || 0) + delta);
      return updated;
    });
  };

  const handleAddToCart = async (food) => {
      const quantity = quantities[food.id];
      const token = localStorage.getItem('jwtToken');

      if (!token || !userId) {
          alert("Please log in to add items to your cart.");
          navigate('/login');
          return;
      }

      if (quantity > 0 && userId) {
          try {
              const itemToAdd = {
                  foodId: food.id,
                  name: food.name,
                  price: food.price,
                  quantity: quantity,
                  imageUrl: food.image
              };

              const response = await axios.post(
                  `http://localhost:8080/api/carts/${userId}/items`,
                  itemToAdd,
                  {
                      headers: {
                          'Authorization': `Bearer ${token}`
                      }
                  }
              );
              console.log("Item added to cart:", response.data);
              alert(`Đã thêm ${quantity} ${food.name} vào giỏ hàng!`);

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

   if (loading) {
     return <div className="text-center py-8">Loading menu...</div>; // Loading indicator
   }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error loading menu: {error.message}</div>;
  }

  // Group foods by category for rendering
  const foodsByCategory = foods.reduce((acc, food) => {
      const category = food.category || 'Other'; // Group by category, default to 'Other' if category is missing
      if (!acc[category]) {
          acc[category] = [];
      }
      acc[category].push(food);
      return acc;
  }, {});

  const getCategoryIcon = (categoryName) => {
    // Map backend categories to your existing icons
    const categoryIcons = {
        'BÁNH MÌ': <FaBreadSlice className="text-red-600 mr-2" />,
        'MÌ': <FaUtensils className="text-red-600 mr-2" />,
        'XÔI': <FaConciergeBell className="text-red-600 mr-2" />,
        'CƠM': <FaDrumstickBite className="text-red-600 mr-2" />,
        'ĐỒ ĂN VẶT': <FaHamburger className="text-red-600 mr-2" />,
        'ĐỒ UỐNG': <FaCoffee className="text-red-600 mr-2" />,
        // Add more mappings as needed
    };
    return categoryIcons[categoryName] || <FaUtensils className="text-red-600 mr-2" />; // Default icon
};


  return (
    <div className="bg-white text-black font-kanit px-4 md:px-8 lg:px-16 py-10 zoom-75">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-red-600">MÓN NGON <span className="text-black">NHÀ UNIFOODIE</span></h1>
        <p className="text-gray-700 mt-2 max-w-3xl mx-auto">
          Từ sáng sớm đến chiều muộn, UniFoodie luôn đồng hành cùng bạn với những lựa chọn món ăn tươi ngon, tiện lợi và đầy năng lượng...
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

      {search.trim() ? ( // Render filtered foods if search is active
        <section className="mb-12">
          <h2 className="text-2xl md:text-1xl font-bold mb-6 flex items-center">
            <FaSearch className="text-red-600 mr-2" />
            <span className="text-red-600">Kết quả tìm kiếm</span>
          </h2>
          {filteredFoods.length === 0 ? (
            <p className="text-gray-600">Không tìm thấy món nào phù hợp.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFoods.map((food) => ( // Use filteredFoods
                <div
                  key={food.id} // Use food.id as key
                  className="border rounded-xl shadow p-4 bg-white flex flex-col justify-between min-h-[400px] relative" // Added relative positioning
                >
                   {/* Favourite Icon */}
                   {userId && ( // Only show if user is logged in
                   <button
                       className="absolute top-3 right-3 text-xl focus:outline-none"
                       onClick={() => toggleFavourite(food)}
                   >
                       <FaHeart
                           className={`text-2xl ${favoriteFoodIds.has(food.id) ? 'text-red-600' : 'text-gray-300 hover:text-red-400'}`}
                       />
                   </button>
                   )}
                  <img src={food.image} alt={food.name} className="w-full h-48 object-cover rounded-md mb-3" />
                  <h3 className="font-semibold text-lg">{food.name}</h3>
                  <p className="text-red-600 font-bold mt-1">{food.price.toLocaleString('vi-VN')}đ</p> {/* Format price */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-4 overflow-hidden">{food.description}</p> {/* Use food.description */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border rounded px-2 py-1">
                      <button onClick={() => handleChange(food.id, -1)} className="px-2 text-xl">−</button> {/* Use food.id */}
                      <span className="px-3">{quantities[food.id] || 0}</span> {/* Use quantities object */}
                      <button onClick={() => handleChange(food.id, 1)} className="px-2 text-xl">+</button> {/* Use food.id */}
                    </div>
                    <button
                      disabled={(quantities[food.id] || 0) === 0 || !userId} // Disable if quantity is 0 or not logged in
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
          )}
        </section>
      ) : ( // Render categorized foods if no search is active
        Object.entries(foodsByCategory).map(([category, items]) => ( // Use foodsByCategory
          <section key={category} className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 flex items-center">
              {getCategoryIcon(category)} {/* Get icon based on category name */}
              <span className="text-red-600">{category}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((food) => ( // Use items within category
                <div
                  key={food.id} // Use food.id as key
                  className="border rounded-xl shadow p-4 bg-white flex flex-col justify-between min-h-[400px] relative" // Added relative positioning
                >
                   {/* Favourite Icon */}
                   {userId && ( // Only show if user is logged in
                   <button
                       className="absolute top-3 right-3 text-xl focus:outline-none"
                       onClick={() => toggleFavourite(food)}
                   >
                       <FaHeart
                           className={`text-2xl ${favoriteFoodIds.has(food.id) ? 'text-red-600' : 'text-gray-300 hover:text-red-400'}`}
                       />
                   </button>
                   )}
                  <img src={food.image} alt={food.name} className="w-full h-48 object-cover rounded-md mb-3" />
                  <h3 className="font-semibold text-lg">{food.name}</h3>
                  <p className="text-red-600 font-bold mt-1">{food.price.toLocaleString('vi-VN')}đ</p> {/* Format price */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-4 overflow-hidden">{food.description}</p> {/* Use food.description */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border rounded px-2 py-1">
                      <button onClick={() => handleChange(food.id, -1)} className="px-2 text-xl">−</button> {/* Use food.id */}
                      <span className="px-3">{quantities[food.id] || 0}</span> {/* Use quantities object */}
                      <button onClick={() => handleChange(food.id, 1)} className="px-2 text-xl">+</button> {/* Use food.id */}
                    </div>
                    <button
                       disabled={(quantities[food.id] || 0) === 0 || !userId} // Disable if quantity is 0 or not logged in
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

export default Menu;