import React, { useState, useEffect } from "react";
import {
    FaBreadSlice,
    FaUtensils,
    FaConciergeBell,
    FaDrumstickBite,
    FaHamburger,
    FaCoffee,
    FaSearch,
    FaHeart,
    FaMinus,
    FaPlus,
    FaShoppingCart,
    FaEye,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import { toast } from "../components/Toast";

const Promotions = () => {
    const navigate = useNavigate();
    const [promotions, setPromotions] = useState([]); // State to store fetched promotions
    const [foods, setFoods] = useState([]); // State to store all fetched food data
    const [promotionalFoods, setPromotionalFoods] = useState({}); // State to store foods grouped by promotion
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState(null); // State to track any errors
    const [quantities, setQuantities] = useState({}); // Use object to store quantities by food ID
    const [search, setSearch] = useState("");
    const [userId, setUserId] = useState(null); // State to store the user ID
    const [favoriteFoodIds, setFavoriteFoodIds] = useState(new Set()); // State to store favorite food IDs
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [promotionFoods, setPromotionFoods] = useState([]);

    // AI Search States
    const [aiRecommendations, setAiRecommendations] = useState([]);
    const [aiSearchLoading, setAiSearchLoading] = useState(false);
    const [showAiRecommendations, setShowAiRecommendations] = useState(false);
    const [lastSearchQuery, setLastSearchQuery] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        setIsLoggedIn(!!token);

        const userData = localStorage.getItem("userData");
        if (userData) {
            try {
                const user = JSON.parse(userData);
                setUserId(user.id || user._id);
            } catch (e) {
                console.error("Failed to parse user data:", e);
            }
        }

        fetchPromotionFoods();
    }, []);

    const fetchPromotionFoods = async () => {
        try {
            // Fetch all foods and filter for promotion items (you can modify this logic)
            const response = await axios.get("http://localhost:8080/api/foods");
            // For demo, let's say foods with price < 30000 are on promotion
            const promoFoods = response.data.filter((food) => food.price < 30000);
            setPromotionFoods(promoFoods);

            // Initialize quantities
            const initialQuantities = {};
            promoFoods.forEach((food) => {
                initialQuantities[food.id] = 0;
            });
            setQuantities(initialQuantities);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching promotion foods:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("Promotions main useEffect running...");
        const token = localStorage.getItem("jwtToken");
        const userDataString = localStorage.getItem("userData");

        console.log("JWT Token from localStorage:", token ? "Found" : "Not found");
        console.log("User Data String from localStorage:", userDataString ? "Found" : "Not found");

        if (!token || !userDataString) {
            console.log("User not logged in or user data missing. Redirecting to login.");
            toast.warning("Vui lòng đăng nhập để xem khuyến mãi và thêm vào giỏ hàng.");
            navigate("/login");
            setLoading(false); // Stop loading if not logged in
            return;
        }

        let currentUserId = null;
        try {
            const userData = JSON.parse(userDataString);
            console.log("Parsed User Data:", userData);
            if (userData && (userData.id || userData._id)) {
                currentUserId = userData.id || userData._id; // Use either id or _id
                setUserId(currentUserId); // Set state
                console.log("User ID parsed and set:", currentUserId);
            } else {
                console.error("User data parsed but 'id' or '_id' field is missing or userData is null.", userData);
                toast.error("Lỗi xử lý dữ liệu người dùng. ID không tìm thấy. Vui lòng đăng nhập lại.");
                navigate("/login");
                setLoading(false); // Stop loading on error
                return;
            }
        } catch (e) {
            console.error("Failed to parse user data from localStorage:", e);
            toast.error("Lỗi xử lý dữ liệu người dùng. Không thể parse JSON. Vui lòng đăng nhập lại.");
            navigate("/login");
            setLoading(false); // Stop loading on error
            return;
        }

        // Fetch user's favorites only if userId is successfully obtained
        const fetchFavorites = async (id) => {
            try {
                console.log("Fetching favorites for user ID:", id);
                const response = await axios.get(`http://localhost:8080/api/users/${id}/favourites`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const favoriteIds = new Set(response.data.map((food) => food.id || food._id)); // Use id or _id consistently
                setFavoriteFoodIds(favoriteIds);
                console.log("Favorites fetched:", favoriteIds);
            } catch (err) {
                console.error("Error fetching favorites:", err);
                toast.error("Không thể tải danh sách yêu thích.");
                // Continue loading main data even if favorites fail
            }
        };

        // Fetch promotions and all food data
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log("Fetching promotions...");
                const promotionsResponse = await axios.get("http://localhost:8080/api/promotions", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the JWT token
                    },
                });
                console.log("Promotions response data:", promotionsResponse.data); // Log fetched promotions
                setPromotions(promotionsResponse.data);

                console.log("Fetching foods...");
                const foodsResponse = await axios.get("http://localhost:8080/api/foods");
                const allFoods = foodsResponse.data;
                console.log("Foods response data:", allFoods); // Log fetched foods
                setFoods(allFoods);

                // Group foods by promotion AFTER both promotions and foods are fetched
                const groupedFoods = {};
                console.log("Starting to group foods by promotion...");
                if (promotionsResponse.data && allFoods) { // Ensure data exists before processing
                    promotionsResponse.data.forEach((promotion) => {
                        console.log("Processing promotion for grouping:", promotion.name, ", Applicable Food IDs:", promotion.applicableFoodIds);
                        const applicableFoods = allFoods.filter(
                            (food) => {
                                const foodIdString = String(food.id || food._id);
                                const isApplicable = Array.isArray(promotion.applicableFoodIds) && promotion.applicableFoodIds.includes(foodIdString);
                                // console.log(`  Checking food ${food.name} (ID: ${foodIdString}): Is applicable? ${isApplicable}`); // Optional: for very detailed logging per food
                                return isApplicable;
                            }
                        );
                        console.log("Found applicable foods for", promotion.name, ":", applicableFoods.length, "items");
                        if (applicableFoods.length > 0) {
                            groupedFoods[promotion.name] = {
                                icon: getCategoryIcon(promotion.name), // Reusing category icons
                                items: applicableFoods.map((food) => ({ ...food, promotionDetails: promotion })), // Add promotion details
                            };
                        }
                    });
                }

                console.log("Finished grouping. Final grouped foods object:", groupedFoods);
                setPromotionalFoods(groupedFoods);

                // Initialize quantities state based on all fetched foods
                const initialQuantities = {};
                allFoods.forEach((food) => {
                    initialQuantities[food.id || food._id] = 0; // Use id or _id consistently
                });
                setQuantities(initialQuantities);

                setLoading(false);

            } catch (err) {
                console.error("Error fetching promotions or foods:", err);
                console.error("Error details:", err.response?.data);
                setError(err);
                setLoading(false);
                toast.error("Không thể tải dữ liệu khuyến mãi hoặc món ăn.");
            }
        };

        // Call fetch operations after user ID is successfully obtained
        if (currentUserId) {
             fetchData(); // Fetch promotions and foods
             fetchFavorites(currentUserId); // Fetch favorites
        }

    }, [navigate]); // Dependency array includes navigate

    const toggleFavourite = async (food) => {
        const token = localStorage.getItem("jwtToken");
        // We don't need to check userId here again if the useEffect ensures we are logged in
        if (!token || !userId) { // Keep check just in case, though should be handled by useEffect redirect
             toast.warning("Vui lòng đăng nhập để đánh dấu món ăn yêu thích.");
             navigate("/login");
             return;
         }

        const foodIdentifier = food.id || food._id; // Use id or _id
        const isCurrentlyFavorite = favoriteFoodIds.has(foodIdentifier);

        try {
            if (isCurrentlyFavorite) {
                // Remove from favorites
                console.log("Attempting to remove from favorites for user", userId, "food", foodIdentifier);
                await axios.delete(`http://localhost:8080/api/users/${userId}/favourites/${foodIdentifier}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFavoriteFoodIds((prev) => {
                    const newState = new Set(prev);
                    newState.delete(foodIdentifier);
                    return newState;
                });
                toast.success("Đã xoá khỏi danh sách yêu thích!");
            } else {
                // Add to favorites
                console.log("Attempting to add to favorites for user", userId, "food", foodIdentifier);
                await axios.post(
                    `http://localhost:8080/api/users/${userId}/favourites`,
                    { foodId: foodIdentifier }, // Send id or _id
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                setFavoriteFoodIds((prev) => new Set(prev).add(foodIdentifier));
                toast.success("Đã thêm vào danh sách yêu thích!");
            }
        } catch (err) {
            console.error("Error toggling favorite status:", err);
            toast.error("Có lỗi xảy ra khi cập nhật yêu thích!");
        }
    };

    const handleChange = (foodId, delta) => {
        setQuantities((prev) => {
            const updated = { ...prev };
            const id = foodId.id || foodId._id; // Use id or _id consistently
            updated[id] = Math.max(0, (updated[id] || 0) + delta); // Use id consistently
            return updated;
        });
    };

    const handleAddToCart = async (food) => {
        const quantity = quantities[food.id || food._id]; // Use id or _id
        const token = localStorage.getItem("jwtToken");

        // We don't need to check userId here again if the useEffect ensures we are logged in
         if (!token || !userId) { // Keep check just in case
             toast.warning("Vui lòng đăng nhập để thêm vào giỏ hàng!");
             navigate("/login");
             return;
         }

        const foodIdentifier = food.id || food._id; // Use id or _id

        if (quantity > 0 && userId) {
            try {
                const itemToAdd = {
                    foodId: foodIdentifier, // Use id or _id
                    name: food.name,
                    price: food.price, // Use original price, promotion discount applied in cart/order
                    quantity: quantity,
                    imageUrl: food.image,
                };

                console.log("Adding to cart for user", userId, ":", itemToAdd);

                await axios.post(`http://localhost:8080/api/carts/${userId}/items`, itemToAdd, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                toast.success(`Đã thêm ${quantity} ${food.name} vào giỏ hàng!`);

                // Reset quantity
                setQuantities((prev) => ({ ...prev, [foodIdentifier]: 0 })); // Use id or _id consistently

                // Trigger custom event to update header cart count
                window.dispatchEvent(new Event("cartUpdated"));
            } catch (err) {
                console.error("Error adding item to cart:", err);
                 const errorMessage = err.response?.data?.message || "Có lỗi xảy ra khi thêm vào giỏ hàng!";
                 toast.error(errorMessage);
            }
        } else if (quantity === 0) {
            toast.warning("Vui lòng chọn số lượng lớn hơn 0!");
        }
    };

    const handleViewDetails = (foodId) => {
        navigate(`/food/${foodId}`); // Pass the correct food ID (id or _id)
    };

    const filteredFoods = foods.filter((food) => food.name.toLowerCase().includes(search.toLowerCase()));

    const getCategoryIcon = (categoryName) => {
        // Map backend categories/promotion names to your existing icons
        const icons = {
            "BÁNH MÌ": <FaBreadSlice className="text-red-600 mr-2" />,
            MÌ: <FaUtensils className="text-red-600 mr-2" />,
            XÔI: <FaConciergeBell className="text-red-600 mr-2" />,
            CƠM: <FaDrumstickBite className="text-red-600 mr-2" />,
            "ĐỒ ĂN VẶT": <FaHamburger className="text-red-600 mr-2" />,
            "ĐỒ UỐNG": <FaCoffee className="text-red-600 mr-2" />,
            // Add more mappings for specific promotion names if needed
            "MÓN MỚI - GIÁ HỜI": <FaHeart className="text-red-600 mr-2" />, // Example mapping for a promotion name
            "COMBO 1 NGƯỜI": <FaUtensils className="text-red-600 mr-2" />,
            "COMBO CẶP ĐÔI": <FaConciergeBell className="text-red-600 mr-2" />,
            "CÀNG ĐÔNG CÀNG DZUI": <FaDrumstickBite className="text-red-600 mr-2" />,
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
                <h1 className="text-4xl md:text-5xl font-extrabold text-red-600">
                    DEAL CỰC CHẤT, <span className="text-black">NHẤT KHÁCH HÀNG</span>
                </h1>
                <p className="text-gray-700 mt-2 max-w-3xl mx-auto">
                    Chào đón bạn với những ưu đãi siêu ngọt ngào mà chỉ UniFoodie mới có! 🎉 Đặt hàng thả ga, nhận ngay
                    giảm giá cực kỳ hấp dẫn với tốc độ giao hàng ánh sáng ✨✨
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredFoods.map((food) => (
                                <div
                                    key={food.id}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                    onClick={() => handleViewDetails(food._id || food.id)}
                                >
                                    <div className="relative">
                                        {/* Favourite Icon */}
                                        {userId && (
                                            <button
                                                className="absolute top-3 right-3 text-2xl focus:outline-none z-10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavourite(food);
                                                }}
                                            >
                                                <FaHeart
                                                    className={`text-2xl ${
                                                        favoriteFoodIds.has(food.id)
                                                            ? "text-red-600"
                                                            : "text-white drop-shadow-lg hover:text-red-400"
                                                    } transition-colors`}
                                                />
                                            </button>
                                        )}
                                        <img src={food.image} alt={food.name} className="w-full h-48 object-cover" />
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">
                                            {food.name}
                                        </h3>

                                        {/* Price section with promotion handling */}
                                        {food.promotionDetails ? (
                                            <div className="mb-3">
                                                <div className="flex items-center">
                                                    <span className="text-gray-500 text-sm line-through mr-2">
                                                        {food.price.toLocaleString("vi-VN")}đ
                                                    </span>
                                                    <span className="text-red-600 font-bold text-xl">
                                                        {(
                                                            food.price *
                                                            (1 - food.promotionDetails.value / 100)
                                                        ).toLocaleString("vi-VN")}
                                                        đ
                                                    </span>
                                                </div>
                                                <p className="text-green-600 font-bold text-sm mt-1">
                                                    Giảm {food.promotionDetails.value}%
                                                </p>
                                                {food.promotionDetails.startDate && food.promotionDetails.endDate && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Áp dụng từ{" "}
                                                        {new Date(food.promotionDetails.startDate).toLocaleDateString()}{" "}
                                                        đến{" "}
                                                        {new Date(food.promotionDetails.endDate).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-red-600 font-bold text-xl mb-3">
                                                {food.price.toLocaleString("vi-VN")}đ
                                            </p>
                                        )}

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                                            {food.description}
                                        </p>

                                        {/* Action Row */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleChange(food, -1);
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-l-lg transition-colors"
                                                    disabled={(quantities[food.id] || 0) <= 0}
                                                >
                                                    <FaMinus size={12} />
                                                </button>
                                                <span className="w-12 h-8 flex items-center justify-center text-gray-800 font-semibold bg-gray-50">
                                                    {quantities[food.id] || 0}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleChange(food, 1);
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-r-lg transition-colors"
                                                >
                                                    <FaPlus size={12} />
                                                </button>
                                            </div>
                                            <button
                                                disabled={(quantities[food.id] || 0) === 0 || !userId}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddToCart(food);
                                                }}
                                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                                                    (quantities[food.id] || 0) === 0 || !userId
                                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                        : "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg"
                                                }`}
                                            >
                                                Thêm vào giỏ
                                            </button>
                                        </div>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {items.map((food) => (
                                <div
                                    key={food.id}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                    onClick={() => handleViewDetails(food._id || food.id)}
                                >
                                    <div className="relative">
                                        {/* Favourite Icon */}
                                        {userId && (
                                            <button
                                                className="absolute top-3 right-3 text-2xl focus:outline-none z-10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavourite(food);
                                                }}
                                            >
                                                <FaHeart
                                                    className={`text-2xl ${
                                                        favoriteFoodIds.has(food.id)
                                                            ? "text-red-600"
                                                            : "text-white drop-shadow-lg hover:text-red-400"
                                                    } transition-colors`}
                                                />
                                            </button>
                                        )}
                                        <img src={food.image} alt={food.name} className="w-full h-48 object-cover" />
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">
                                            {food.name}
                                        </h3>

                                        {/* Price section with promotion handling */}
                                        {food.promotionDetails ? (
                                            <div className="mb-3">
                                                <div className="flex items-center">
                                                    <span className="text-gray-500 text-sm line-through mr-2">
                                                        {food.price.toLocaleString("vi-VN")}đ
                                                    </span>
                                                    <span className="text-red-600 font-bold text-xl">
                                                        {(
                                                            food.price *
                                                            (1 - food.promotionDetails.value / 100)
                                                        ).toLocaleString("vi-VN")}
                                                        đ
                                                    </span>
                                                </div>
                                                <p className="text-green-600 font-bold text-sm mt-1">
                                                    Giảm {food.promotionDetails.value}%
                                                </p>
                                                {food.promotionDetails.startDate && food.promotionDetails.endDate && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Áp dụng từ{" "}
                                                        {new Date(food.promotionDetails.startDate).toLocaleDateString()}{" "}
                                                        đến{" "}
                                                        {new Date(food.promotionDetails.endDate).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-red-600 font-bold text-xl mb-3">
                                                {food.price.toLocaleString("vi-VN")}đ
                                            </p>
                                        )}

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                                            {food.description}
                                        </p>

                                        {/* Action Row */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleChange(food, -1);
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-l-lg transition-colors"
                                                    disabled={(quantities[food.id] || 0) <= 0}
                                                >
                                                    <FaMinus size={12} />
                                                </button>
                                                <span className="w-12 h-8 flex items-center justify-center text-gray-800 font-semibold bg-gray-50">
                                                    {quantities[food.id] || 0}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleChange(food, 1);
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-r-lg transition-colors"
                                                >
                                                    <FaPlus size={12} />
                                                </button>
                                            </div>
                                            <button
                                                disabled={(quantities[food.id] || 0) === 0 || !userId}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddToCart(food);
                                                }}
                                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                                                    (quantities[food.id] || 0) === 0 || !userId
                                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                        : "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg"
                                                }`}
                                            >
                                                Thêm vào giỏ
                                            </button>
                                        </div>
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
