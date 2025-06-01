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
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import aiRecommendationService from "../services/aiRecommendationService"; // Import AI service

const Menu = () => {
    const navigate = useNavigate();
    const [foods, setFoods] = useState([]); // State to store fetched food data
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState(null); // State to track any errors
    const [quantities, setQuantities] = useState({}); // Use object to store quantities by food ID
    const [search, setSearch] = useState("");
    const [userId, setUserId] = useState(null); // State to store the user ID
    const [favoriteFoodIds, setFavoriteFoodIds] = useState(new Set()); // State to store favorite food IDs

    // AI Search States
    const [aiRecommendations, setAiRecommendations] = useState([]);
    const [aiSearchLoading, setAiSearchLoading] = useState(false);
    const [showAiRecommendations, setShowAiRecommendations] = useState(false);
    const [lastSearchQuery, setLastSearchQuery] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        const userData = localStorage.getItem("userData");

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
                navigate("/login"); // Redirect to login on data parse error
                setLoading(false); // Stop loading on error
                return; // Exit useEffect if user data is invalid
            }

            // Fetch user's favorites after getting userId
            const fetchFavorites = async (id) => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/users/${id}/favourites`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    // Assuming the response data is an array of favorite food objects
                    const favoriteIds = new Set(response.data.map((food) => food.id));
                    setFavoriteFoodIds(favoriteIds);
                } catch (err) {
                    console.error("Error fetching favorites:", err);
                    // Handle error, but don't block food loading
                }
            };
            if (userId) {
                // Only fetch favorites if userId is available
                fetchFavorites(userId);
            }
        }

        // Fetch food data from the backend - this can happen regardless of login status
        const fetchFoods = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/foods");
                setFoods(response.data);

                const initialQuantities = {};
                response.data.forEach((food) => {
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
        const token = localStorage.getItem("jwtToken");
        if (!token || !userId) {
            alert("Please log in to mark items as favourites.");
            navigate("/login");
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
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFavoriteFoodIds((prev) => {
                    const newState = new Set(prev);
                    newState.delete(food.id);
                    return newState;
                });
                alert("Đã xoá khỏi danh sách yêu thích!");
            } else {
                // Add to favorites
                console.log("Attempting to add to favorites...");
                await axios.post(
                    `http://localhost:8080/api/users/${userId}/favourites`,
                    { foodId: food.id },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                setFavoriteFoodIds((prev) => new Set(prev).add(food.id));
                alert("Đã thêm vào danh sách yêu thích!");
            }
        } catch (err) {
            console.error("Error toggling favorite status:", err);
            alert("Failed to update favourite status.");
        }
    };

    const handleChange = (foodId, delta) => {
        setQuantities((prev) => {
            const updated = { ...prev };
            updated[foodId] = Math.max(0, (updated[foodId] || 0) + delta);
            return updated;
        });
    };

    const handleAddToCart = async (food) => {
        const quantity = quantities[food.id];
        const token = localStorage.getItem("jwtToken");

        if (!token || !userId) {
            alert("Please log in to add items to your cart.");
            navigate("/login");
            return;
        }

        if (quantity > 0 && userId) {
            try {
                const itemToAdd = {
                    foodId: food.id,
                    name: food.name,
                    price: food.price,
                    quantity: quantity,
                    imageUrl: food.image,
                };

                const response = await axios.post(`http://localhost:8080/api/carts/${userId}/items`, itemToAdd, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Item added to cart:", response.data);
                alert(`Đã thêm ${quantity} ${food.name} vào giỏ hàng!`);

                setQuantities((prev) => ({ ...prev, [food.id]: 0 }));
            } catch (err) {
                console.error("Error adding item to cart:", err);
                alert("Failed to add item to cart.");
            }
        } else if (quantity === 0) {
            alert("Please select a quantity greater than 0.");
        }
    };

    const filteredFoods = foods.filter((food) => food.name.toLowerCase().includes(search.toLowerCase()));

    // AI Search Handler
    const handleAiSearch = async (query) => {
        if (!query.trim() || query === lastSearchQuery) {
            return;
        }

        setLastSearchQuery(query);
        setAiSearchLoading(true);

        try {
            console.log("🔍 Searching with AI for:", query);
            const result = await aiRecommendationService.searchWithRecommendations(query);

            if (result.success && result.data && result.data.length > 0) {
                console.log("✅ AI search recommendations:", result.data);

                // Match AI recommendations with actual food data
                const matchedRecommendations = result.data
                    .map((rec) => {
                        const food = foods.find((f) => f.id === rec.food_id || f.id === rec.id);
                        if (food) {
                            return {
                                ...food,
                                aiScore: rec.score || rec.confidence || 1,
                                aiReason: rec.reason || `Phù hợp với nguyên liệu: ${query}`,
                                searchIngredients: rec.ingredients || [],
                            };
                        }
                        return null;
                    })
                    .filter(Boolean)
                    .slice(0, 6); // Limit to 6 items

                setAiRecommendations(matchedRecommendations);
                setShowAiRecommendations(matchedRecommendations.length > 0);
                console.log("🎯 AI matched recommendations:", matchedRecommendations);
            } else {
                console.log("ℹ️ No AI recommendations found for:", query);
                setAiRecommendations([]);
                setShowAiRecommendations(false);
            }
        } catch (error) {
            console.error("❌ AI search error:", error);
            setAiRecommendations([]);
            setShowAiRecommendations(false);
        } finally {
            setAiSearchLoading(false);
        }
    };

    // Debounce AI search
    useEffect(() => {
        if (!search.trim()) {
            setShowAiRecommendations(false);
            setAiRecommendations([]);
            setLastSearchQuery("");
            return;
        }

        const searchTimeout = setTimeout(() => {
            handleAiSearch(search);
        }, 1000); // 1 second delay

        return () => clearTimeout(searchTimeout);
    }, [search, foods]); // Re-run when search or foods change

    if (loading) {
        return <div className="text-center py-8">Loading menu...</div>; // Loading indicator
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">Error loading menu: {error.message}</div>;
    }

    // Group foods by category for rendering
    const foodsByCategory = foods.reduce((acc, food) => {
        const category = food.category || "Other"; // Group by category, default to 'Other' if category is missing
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(food);
        return acc;
    }, {});

    const getCategoryIcon = (categoryName) => {
        // Map backend categories to your existing icons
        const categoryIcons = {
            "BÁNH MÌ": <FaBreadSlice className="text-red-600 mr-2" />,
            MÌ: <FaUtensils className="text-red-600 mr-2" />,
            XÔI: <FaConciergeBell className="text-red-600 mr-2" />,
            CƠM: <FaDrumstickBite className="text-red-600 mr-2" />,
            "ĐỒ ĂN VẶT": <FaHamburger className="text-red-600 mr-2" />,
            "ĐỒ UỐNG": <FaCoffee className="text-red-600 mr-2" />,
            // Add more mappings as needed
        };
        return categoryIcons[categoryName] || <FaUtensils className="text-red-600 mr-2" />; // Default icon
    };

    return (
        <div className="bg-white text-black font-kanit px-4 md:px-8 lg:px-16 py-10 zoom-75">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-red-600">
                    MÓN NGON <span className="text-black">NHÀ UNIFOODIE</span>
                </h1>
                <p className="text-gray-700 mt-2 max-w-3xl mx-auto">
                    Từ sáng sớm đến chiều muộn, UniFoodie luôn đồng hành cùng bạn với những lựa chọn món ăn tươi ngon,
                    tiện lợi và đầy năng lượng...
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
                <div>
                    {/* AI Recommendations Section */}
                    {showAiRecommendations && aiRecommendations.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
                                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm mr-3">
                                    🤖 AI
                                </span>
                                <span className="text-purple-600">Gợi ý thông minh</span>
                                <span className="text-gray-500 text-sm ml-2 font-normal">
                                    (dựa trên nguyên liệu bạn tìm)
                                </span>
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {aiRecommendations.map((food) => (
                                    <div
                                        key={`ai-${food.id}`}
                                        className="border-2 border-purple-200 rounded-xl shadow-lg p-4 bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col justify-between min-h-[400px] relative transform hover:scale-105 transition-transform duration-200"
                                        onClick={() => navigate(`/food/${food._id || food.id}`)}
                                    >
                                        {/* AI Badge */}
                                        <div className="absolute top-2 left-2 z-10">
                                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                🤖 AI {food.aiScore && `${Math.round(food.aiScore * 100)}%`}
                                            </span>
                                        </div>

                                        {/* Favourite Icon */}
                                        {userId && (
                                            <button
                                                className="absolute top-2 right-2 text-xl focus:outline-none"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavourite(food);
                                                }}
                                            >
                                                <FaHeart
                                                    className={`text-2xl ${
                                                        favoriteFoodIds.has(food.id)
                                                            ? "text-red-600"
                                                            : "text-gray-300 hover:text-red-400"
                                                    }`}
                                                />
                                            </button>
                                        )}

                                        <img
                                            src={food.image}
                                            alt={food.name}
                                            className="w-full h-48 object-cover rounded-md mb-3 mt-6"
                                        />
                                        <h3 className="font-semibold text-lg">{food.name}</h3>
                                        <p className="text-red-600 font-bold mt-1">
                                            {food.price.toLocaleString("vi-VN")}đ
                                        </p>
                                        <p className="text-sm text-gray-600 mb-2 line-clamp-3 overflow-hidden">
                                            {food.description}
                                        </p>

                                        {/* AI Reason */}
                                        <p className="text-xs text-purple-600 italic mb-3 bg-white/50 rounded p-2">
                                            💡 {food.aiReason}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center border-2 border-purple-300 rounded px-2 py-1 bg-white">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleChange(food.id, -1);
                                                    }}
                                                    className="px-2 text-xl text-purple-600"
                                                >
                                                    −
                                                </button>
                                                <span className="px-3 font-semibold text-purple-800">
                                                    {quantities[food.id] || 0}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleChange(food.id, 1);
                                                    }}
                                                    className="px-2 text-xl text-purple-600"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                disabled={(quantities[food.id] || 0) === 0 || !userId}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddToCart(food);
                                                }}
                                                className={`text-sm px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                                                    (quantities[food.id] || 0) === 0 || !userId
                                                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                        : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-md"
                                                }`}
                                            >
                                                Thêm vào giỏ
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* AI Search Loading */}
                    {aiSearchLoading && (
                        <section className="mb-8">
                            <div className="flex justify-center items-center py-8">
                                <div className="flex items-center gap-3">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                                    <span className="text-purple-600">AI đang tìm món phù hợp với nguyên liệu...</span>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Regular Search Results */}
                    <section className="mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
                            <FaSearch className="text-red-600 mr-2" />
                            <span className="text-red-600">Kết quả tìm kiếm</span>
                            <span className="text-gray-500 text-sm ml-2 font-normal">
                                ({filteredFoods.length} món được tìm thấy)
                            </span>
                        </h2>
                        {filteredFoods.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-4">🔍</div>
                                <p className="text-gray-600 text-lg">Không tìm thấy món nào phù hợp với "{search}"</p>
                                <p className="text-gray-500 text-sm mt-2">
                                    Thử tìm bằng tên món hoặc nguyên liệu như "thịt", "gà", "rau"...
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredFoods.map((food) => (
                                    <div
                                        key={food.id}
                                        className="border rounded-xl shadow p-4 bg-white flex flex-col justify-between min-h-[400px] relative cursor-pointer hover:shadow-lg transition-shadow"
                                        onClick={() => navigate(`/food/${food._id || food.id}`)}
                                    >
                                        {/* Favourite Icon */}
                                        {userId && (
                                            <button
                                                className="absolute top-3 right-3 text-xl focus:outline-none z-10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavourite(food);
                                                }}
                                            >
                                                <FaHeart
                                                    className={`text-2xl ${
                                                        favoriteFoodIds.has(food.id)
                                                            ? "text-red-600"
                                                            : "text-gray-300 hover:text-red-400"
                                                    }`}
                                                />
                                            </button>
                                        )}
                                        <img
                                            src={food.image}
                                            alt={food.name}
                                            className="w-full h-48 object-cover rounded-md mb-3"
                                        />
                                        <h3 className="font-semibold text-lg">{food.name}</h3>
                                        <p className="text-red-600 font-bold mt-1">
                                            {food.price.toLocaleString("vi-VN")}đ
                                        </p>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-4 overflow-hidden">
                                            {food.description}
                                        </p>
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center border rounded px-2 py-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleChange(food.id, -1);
                                                    }}
                                                    className="px-2 text-xl"
                                                >
                                                    −
                                                </button>
                                                <span className="px-3">{quantities[food.id] || 0}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleChange(food.id, 1);
                                                    }}
                                                    className="px-2 text-xl"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                disabled={(quantities[food.id] || 0) === 0 || !userId}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddToCart(food);
                                                }}
                                                className={`text-sm px-4 py-1 rounded transition duration-300 ${
                                                    (quantities[food.id] || 0) === 0 || !userId
                                                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                        : "bg-red-600 text-white hover:bg-red-700"
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
                </div>
            ) : (
                // Render categorized foods if no search is active
                Object.entries(foodsByCategory).map(
                    (
                        [category, items] // Use foodsByCategory
                    ) => (
                        <section key={category} className="mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 flex items-center">
                                {getCategoryIcon(category)} {/* Get icon based on category name */}
                                <span className="text-red-600">{category}</span>
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {items.map(
                                    (
                                        food // Use items within category
                                    ) => (
                                        <div
                                            key={food.id} // Use food.id as key
                                            className="border rounded-xl shadow p-4 bg-white flex flex-col justify-between min-h-[400px] relative cursor-pointer hover:shadow-lg transition-shadow" // Added relative positioning
                                            onClick={() => navigate(`/food/${food._id || food.id}`)}
                                        >
                                            {/* Favourite Icon */}
                                            {userId && ( // Only show if user is logged in
                                                <button
                                                    className="absolute top-3 right-3 text-xl focus:outline-none z-10"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavourite(food);
                                                    }}
                                                >
                                                    <FaHeart
                                                        className={`text-2xl ${
                                                            favoriteFoodIds.has(food.id)
                                                                ? "text-red-600"
                                                                : "text-gray-300 hover:text-red-400"
                                                        }`}
                                                    />
                                                </button>
                                            )}
                                            <img
                                                src={food.image}
                                                alt={food.name}
                                                className="w-full h-48 object-cover rounded-md mb-3"
                                            />
                                            <h3 className="font-semibold text-lg">{food.name}</h3>
                                            <p className="text-red-600 font-bold mt-1">
                                                {food.price.toLocaleString("vi-VN")}đ
                                            </p>{" "}
                                            {/* Format price */}
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-4 overflow-hidden">
                                                {food.description}
                                            </p>{" "}
                                            {/* Use food.description */}
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center border rounded px-2 py-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleChange(food.id, -1);
                                                        }}
                                                        className="px-2 text-xl"
                                                    >
                                                        −
                                                    </button>{" "}
                                                    {/* Use food.id */}
                                                    <span className="px-3">{quantities[food.id] || 0}</span>{" "}
                                                    {/* Use quantities object */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleChange(food.id, 1);
                                                        }}
                                                        className="px-2 text-xl"
                                                    >
                                                        +
                                                    </button>{" "}
                                                    {/* Use food.id */}
                                                </div>
                                                <button
                                                    disabled={(quantities[food.id] || 0) === 0 || !userId} // Disable if quantity is 0 or not logged in
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddToCart(food);
                                                    }} // Pass the food object
                                                    className={`text-sm px-4 py-1 rounded transition duration-300 ${
                                                        (quantities[food.id] || 0) === 0 || !userId
                                                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                            : "bg-red-600 text-white hover:bg-red-700"
                                                    }`}
                                                >
                                                    Thêm vào giỏ
                                                </button>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </section>
                    )
                )
            )}
        </div>
    );
};

export default Menu;
