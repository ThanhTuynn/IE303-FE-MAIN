import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import aiRecommendationService from "../services/aiRecommendationService";
import useNotification from "../hooks/useNotification";

const FoodDetail = () => {
    const { foodId } = useParams();
    const navigate = useNavigate();
    const notify = useNotification();

    // States
    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [specialInstructions, setSpecialInstructions] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);

    // User states
    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // AI Recommendations states
    const [relatedFoods, setRelatedFoods] = useState([]);
    const [recommendationsLoading, setRecommendationsLoading] = useState(false);
    const [aiServiceAvailable, setAiServiceAvailable] = useState(false);

    // Get user info
    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        const userData = localStorage.getItem("userData");

        setIsLoggedIn(!!token);

        if (userData) {
            try {
                const user = JSON.parse(userData);
                setUserId(user.id || user._id);
            } catch (e) {
                console.error("Failed to parse user data:", e);
            }
        }
    }, []);

    // Fetch food details
    useEffect(() => {
        const fetchFoodDetail = async () => {
            if (!foodId) return;

            try {
                setLoading(true);

                // Try with _id first (MongoDB ObjectId), then fallback to numeric id
                let response;
                try {
                    response = await axios.get(`http://localhost:8080/api/foods/${foodId}`);
                } catch (error) {
                    if (error.response?.status === 404) {
                        // Try to find food by numeric id from the foods list
                        const allFoodsResponse = await axios.get("http://localhost:8080/api/foods");
                        const foundFood = allFoodsResponse.data.find(
                            (food) => food.id === parseInt(foodId) || food._id === foodId
                        );

                        if (foundFood) {
                            response = { data: foundFood };
                        } else {
                            throw new Error("Food not found");
                        }
                    } else {
                        throw error;
                    }
                }

                let foodData = response.data;

                // Add fallback ingredients if not present
                if (!foodData.ingredients || foodData.ingredients.length === 0) {
                    foodData.ingredients = generateFallbackIngredients(foodData.name, foodData.category);
                }

                // Ensure ingredients is always an array
                if (!Array.isArray(foodData.ingredients)) {
                    if (typeof foodData.ingredients === "string") {
                        // If ingredients is a string, split it
                        foodData.ingredients = foodData.ingredients
                            .split(",")
                            .map((item) => item.trim())
                            .filter(Boolean);
                    } else {
                        // If ingredients is something else, use fallback
                        foodData.ingredients = generateFallbackIngredients(foodData.name, foodData.category);
                    }
                }

                // Add some additional mock data if not present
                if (!foodData.cookingTime) {
                    foodData.cookingTime = Math.floor(Math.random() * 20) + 10; // 10-30 minutes
                }

                if (!foodData.calories) {
                    foodData.calories = Math.floor(Math.random() * 300) + 200; // 200-500 kcal
                }

                if (!foodData.difficulty) {
                    const difficulties = ["Dễ", "Trung bình", "Khó"];
                    foodData.difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
                }

                setFood(foodData);

                // Check if food is in favorites (if user is logged in)
                if (userId) {
                    const token = localStorage.getItem("jwtToken");
                    try {
                        const favResponse = await axios.get(`http://localhost:8080/api/users/${userId}/favourites`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        const favoriteIds = new Set(favResponse.data.map((fav) => fav.id || fav._id));
                        setIsFavorite(favoriteIds.has(foodId) || favoriteIds.has(parseInt(foodId)));
                    } catch (favError) {
                        console.error("Error checking favorite status:", favError);
                    }
                }
            } catch (err) {
                console.error("Error fetching food detail:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFoodDetail();
    }, [foodId, userId]);

    // Helper function to generate fallback ingredients based on food name and category
    const generateFallbackIngredients = (foodName, category) => {
        const name = foodName?.toLowerCase() || "";
        const cat = category?.toLowerCase() || "";

        // Common ingredients for different food types
        const ingredientMap = {
            // Bánh mì
            "bánh mì": ["Bánh mì", "Thịt", "Rau cải", "Cà chua", "Dưa chuột", "Pate", "Mayonnaise"],
            "bánh đúc": ["Bột gạo", "Thịt băm", "Tôm", "Mộc nhĩ", "Hành tím", "Nước mắm"],

            // Mì
            mì: ["Mì tươi", "Thịt heo", "Tôm", "Rau cải", "Hành lá", "Nước dùng"],
            bún: ["Bún tươi", "Thịt", "Rau thơm", "Nước mắm", "Chanh", "Ớt"],

            // Cơm
            cơm: ["Gạo", "Thịt", "Rau củ", "Gia vị", "Nước mắm"],
            xôi: ["Gạo nếp", "Đậu xanh", "Nước cốt dừa", "Muối", "Đường"],

            // Đồ ăn vặt
            snack: ["Bột mì", "Trứng", "Sữa", "Đường", "Gia vị"],

            // Đồ uống
            uống: ["Nước", "Đường", "Chanh", "Đá"],
        };

        // Try to find matching ingredients
        for (const [key, ingredients] of Object.entries(ingredientMap)) {
            if (name.includes(key) || cat.includes(key)) {
                return ingredients;
            }
        }

        // Default ingredients based on category
        if (cat.includes("bánh")) {
            return ["Bột mì", "Trứng", "Sữa", "Đường", "Gia vị"];
        } else if (cat.includes("mì") || cat.includes("bún")) {
            return ["Mì/Bún", "Thịt", "Rau cải", "Hành lá", "Nước dùng"];
        } else if (cat.includes("cơm")) {
            return ["Gạo", "Thịt", "Rau củ", "Gia vị"];
        } else if (cat.includes("uống")) {
            return ["Nước", "Đường", "Hương liệu tự nhiên"];
        }

        // Default fallback
        return ["Nguyên liệu tươi ngon", "Gia vị đặc biệt", "Chế biến theo công thức truyền thống"];
    };

    // Fetch AI recommendations for related foods
    useEffect(() => {
        const fetchRelatedFoods = async () => {
            if (!foodId) return;

            try {
                setRecommendationsLoading(true);

                console.log("🍔 Fetching food-based recommendations for food:", foodId);
                const result = await aiRecommendationService.getFoodBasedRecommendations(foodId);

                if (result.success && result.data && result.data.length > 0) {
                    console.log("✅ AI related foods received:", result.data);
                    setAiServiceAvailable(true);

                    // Fetch detailed food data for recommended items
                    const foodPromises = result.data.slice(0, 3).map(async (rec) => {
                        try {
                            // Try to find food from current foods list first
                            const allFoodsResponse = await axios.get("http://localhost:8080/api/foods");
                            const foundFood = allFoodsResponse.data.find(
                                (food) =>
                                    food.id === rec.food_id ||
                                    food._id === rec.food_id ||
                                    food.id === rec.id ||
                                    food._id === rec.id
                            );

                            if (foundFood) {
                                return {
                                    ...foundFood,
                                    aiScore: rec.score || rec.confidence || 1,
                                    aiReason: rec.reason || "Món ăn tương tự",
                                };
                            }
                            return null;
                        } catch (error) {
                            console.error("Error fetching related food details:", error);
                            return null;
                        }
                    });

                    const relatedFoodsData = (await Promise.all(foodPromises)).filter(Boolean);
                    setRelatedFoods(relatedFoodsData);
                } else {
                    console.log("ℹ️ No AI related foods found, using fallback");
                    setAiServiceAvailable(false);

                    // Fallback: Get some random foods from same category
                    try {
                        const allFoodsResponse = await axios.get("http://localhost:8080/api/foods");
                        const sameCategoryFoods = allFoodsResponse.data
                            .filter(
                                (f) => f._id !== foodId && f.id !== parseInt(foodId) && f.category === food?.category
                            )
                            .slice(0, 3);
                        setRelatedFoods(sameCategoryFoods);
                    } catch (error) {
                        console.error("Error fetching fallback foods:", error);
                    }
                }
            } catch (error) {
                console.error("❌ Error fetching AI recommendations:", error);
                setAiServiceAvailable(false);
                setRelatedFoods([]);
            } finally {
                setRecommendationsLoading(false);
            }
        };

        if (food) {
            fetchRelatedFoods();
        }
    }, [foodId, food]);

    // Handle quantity change
    const handleQuantityChange = (delta) => {
        setQuantity((prev) => Math.max(1, prev + delta));
    };

    // Handle favorite toggle
    const handleFavoriteToggle = async () => {
        if (!isLoggedIn || !userId) {
            notify.warning("Vui lòng đăng nhập để thêm vào yêu thích!");
            navigate("/login");
            return;
        }

        const token = localStorage.getItem("jwtToken");

        try {
            const foodIdToUse = food._id || food.id;

            if (isFavorite) {
                // Remove from favorites
                await axios.delete(`http://localhost:8080/api/users/${userId}/favourites/${foodIdToUse}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIsFavorite(false);
                notify.success("Đã xóa khỏi danh sách yêu thích!");
            } else {
                // Add to favorites
                await axios.post(
                    `http://localhost:8080/api/users/${userId}/favourites`,
                    { foodId: foodIdToUse },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                setIsFavorite(true);
                notify.success("Đã thêm vào danh sách yêu thích!");
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
            notify.error("Có lỗi xảy ra khi cập nhật yêu thích!");
        }
    };

    // Handle add to cart
    const handleAddToCart = async () => {
        if (!isLoggedIn || !userId) {
            notify.warning("Vui lòng đăng nhập để thêm vào giỏ hàng!");
            navigate("/login");
            return;
        }

        const token = localStorage.getItem("jwtToken");

        try {
            const itemToAdd = {
                foodId: food._id || food.id,
                name: food.name,
                price: food.price,
                quantity: quantity,
                imageUrl: food.image,
                specialInstructions: specialInstructions,
            };

            await axios.post(`http://localhost:8080/api/carts/${userId}/items`, itemToAdd, {
                headers: { Authorization: `Bearer ${token}` },
            });

            notify.success(`Đã thêm ${quantity} ${food.name} vào giỏ hàng!`);
            setQuantity(1);
            setSpecialInstructions("");

            // Trigger event to update cart count in header
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (error) {
            console.error("Error adding to cart:", error);
            notify.error("Có lỗi xảy ra khi thêm vào giỏ hàng!");
        }
    };

    // Handle buy now
    const handleBuyNow = () => {
        if (!isLoggedIn || !userId) {
            notify.warning("Vui lòng đăng nhập để mua hàng!");
            navigate("/login");
            return;
        }

        // Navigate to payment with current item
        const cartData = {
            cartItems: [
                {
                    id: food._id || food.id,
                    name: food.name,
                    price: food.price,
                    quantity: quantity,
                    image: food.image,
                },
            ],
            totalAmount: food.price * quantity,
            customerInfo: {
                name: "Customer",
                email: "customer@unifoodie.com",
                phone: "0123456789",
            },
        };

        navigate("/payment", { state: cartData });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin món ăn...</p>
                </div>
            </div>
        );
    }

    if (error || !food) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😞</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy món ăn</h2>
                    <p className="text-gray-600 mb-6">Món ăn bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                    <button
                        onClick={() => navigate("/menu")}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                        Quay lại thực đơn
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-kanit">
            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="md:flex">
                        {/* Food Image */}
                        <div className="md:w-1/2">
                            <img src={food.image} alt={food.name} className="w-full h-96 md:h-full object-cover" />
                        </div>

                        {/* Food Info */}
                        <div className="md:w-1/2 p-8">
                            <div className="flex justify-between items-start mb-4">
                                <h1 className="text-3xl font-bold text-gray-800">{food.name}</h1>
                                <button onClick={handleFavoriteToggle} className="text-2xl focus:outline-none">
                                    <FaHeart
                                        className={`${
                                            isFavorite ? "text-red-600" : "text-gray-300 hover:text-red-400"
                                        } transition-colors`}
                                    />
                                </button>
                            </div>

                            <p className="text-3xl font-bold text-red-600 mb-6">
                                {food.price.toLocaleString("vi-VN")}đ
                            </p>

                            {/* Quantity Selector */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng</label>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-red-600 hover:text-red-600 transition-colors"
                                    >
                                        <FaMinus size={14} />
                                    </button>
                                    <span className="text-xl font-semibold px-4">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-red-600 hover:text-red-600 transition-colors"
                                    >
                                        <FaPlus size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Special Instructions */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ghi chú cho UniFoodie:
                                </label>
                                <textarea
                                    value={specialInstructions}
                                    onChange={(e) => setSpecialInstructions(e.target.value)}
                                    placeholder="Nhập yêu cầu của bạn về cách chế biến..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                                    rows="3"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-white border-2 border-red-600 text-red-600 font-semibold py-3 px-6 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
                                >
                                    <FaShoppingCart />
                                    <span>Thêm vào giỏ</span>
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="flex-1 bg-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Mua ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Food Description */}
                <div className="bg-white rounded-xl shadow-lg mt-8 p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Mô tả sản phẩm</h2>
                    <p className="text-gray-600 leading-relaxed mb-6">
                        {food.description || "Món ăn ngon với hương vị tuyệt vời từ UniFoodie."}
                    </p>

                    {/* Ingredients Section */}
                    {food.ingredients && Array.isArray(food.ingredients) && food.ingredients.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <span className="mr-2">🥘</span>
                                Nguyên liệu chính
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {food.ingredients.map((ingredient, index) => (
                                    <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                                        <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                                        <span className="text-gray-700">{ingredient}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Food Details */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Chi tiết sản phẩm</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                    <span className="font-medium text-gray-700 flex items-center">
                                        <span className="mr-2">📂</span>
                                        Danh mục
                                    </span>
                                    <span className="text-gray-600 font-medium">{food.category || "Đặc sản"}</span>
                                </div>

                                {food.cookingTime && (
                                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                        <span className="font-medium text-gray-700 flex items-center">
                                            <span className="mr-2">⏰</span>
                                            Thời gian chế biến
                                        </span>
                                        <span className="text-gray-600 font-medium">{food.cookingTime} phút</span>
                                    </div>
                                )}

                                {food.spicyLevel && (
                                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                        <span className="font-medium text-gray-700 flex items-center">
                                            <span className="mr-2">🌶️</span>
                                            Độ cay
                                        </span>
                                        <span className="text-gray-600 font-medium">
                                            {food.spicyLevel === 1 && "Không cay"}
                                            {food.spicyLevel === 2 && "Nhẹ"}
                                            {food.spicyLevel === 3 && "Vừa"}
                                            {food.spicyLevel === 4 && "Cay"}
                                            {food.spicyLevel === 5 && "Rất cay"}
                                        </span>
                                    </div>
                                )}

                                {food.difficulty && (
                                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                        <span className="font-medium text-gray-700 flex items-center">
                                            <span className="mr-2">👨‍🍳</span>
                                            Độ khó chế biến
                                        </span>
                                        <span
                                            className={`font-medium ${
                                                food.difficulty === "Dễ"
                                                    ? "text-green-600"
                                                    : food.difficulty === "Trung bình"
                                                    ? "text-yellow-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {food.difficulty}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                    <span className="font-medium text-gray-700 flex items-center">
                                        <span className="mr-2">🏷️</span>
                                        Giá
                                    </span>
                                    <span className="text-red-600 font-bold text-lg">
                                        {food.price.toLocaleString("vi-VN")}đ
                                    </span>
                                </div>

                                {food.calories && (
                                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                        <span className="font-medium text-gray-700 flex items-center">
                                            <span className="mr-2">🔥</span>
                                            Calories
                                        </span>
                                        <span className="text-gray-600 font-medium">{food.calories} kcal</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                    <span className="font-medium text-gray-700 flex items-center">
                                        <span className="mr-2">✅</span>
                                        Tình trạng
                                    </span>
                                    <span className="text-green-600 font-medium">Có sẵn</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Special Features */}
                    {(food.isVegetarian || food.isSpicy || food.isPopular) && (
                        <div className="border-t border-gray-200 pt-6 mt-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Đặc điểm nổi bật</h3>
                            <div className="flex flex-wrap gap-3">
                                {food.isVegetarian && (
                                    <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium flex items-center">
                                        <span className="mr-2">🌱</span>
                                        Chay
                                    </span>
                                )}
                                {food.isSpicy && (
                                    <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium flex items-center">
                                        <span className="mr-2">🌶️</span>
                                        Cay
                                    </span>
                                )}
                                {food.isPopular && (
                                    <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium flex items-center">
                                        <span className="mr-2">⭐</span>
                                        Phổ biến
                                    </span>
                                )}
                                {food.isNew && (
                                    <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium flex items-center">
                                        <span className="mr-2">🆕</span>
                                        Mới
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Nutritional Information */}
                    {(food.protein || food.carbs || food.fat || food.fiber) && (
                        <div className="border-t border-gray-200 pt-6 mt-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <span className="mr-2">📊</span>
                                Thông tin dinh dưỡng (100g)
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {food.protein && (
                                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-blue-600">{food.protein}g</div>
                                        <div className="text-sm text-blue-800">Protein</div>
                                    </div>
                                )}
                                {food.carbs && (
                                    <div className="bg-green-50 p-4 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-green-600">{food.carbs}g</div>
                                        <div className="text-sm text-green-800">Carbs</div>
                                    </div>
                                )}
                                {food.fat && (
                                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-orange-600">{food.fat}g</div>
                                        <div className="text-sm text-orange-800">Chất béo</div>
                                    </div>
                                )}
                                {food.fiber && (
                                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-purple-600">{food.fiber}g</div>
                                        <div className="text-sm text-purple-800">Chất xơ</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* AI Recommendations Section */}
                <div className="mt-12">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            <span className="text-red-600">CÓ THỂ</span> BẠN SẼ THÍCH
                        </h2>

                        {/* AI Status Badge */}
                        <div className="flex justify-center mb-4">
                            {aiServiceAvailable ? (
                                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                                    🤖 Được đề xuất bởi AI dựa trên món ăn tương tự
                                </span>
                            ) : (
                                <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                                    ⭐ Món ăn cùng danh mục
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Recommendations Loading */}
                    {recommendationsLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="flex items-center gap-3">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                                <span className="text-gray-600">Đang tìm món ăn tương tự...</span>
                            </div>
                        </div>
                    ) : relatedFoods.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🍽️</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có món ăn tương tự</h3>
                            <p className="text-gray-600">Hãy khám phá thực đơn để tìm những món ăn ngon khác!</p>
                        </div>
                    ) : (
                        /* Display Related Foods */
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedFoods.map((relatedFood) => (
                                <div
                                    key={relatedFood._id || relatedFood.id}
                                    className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-200 ${
                                        aiServiceAvailable ? "border-2 border-purple-200" : ""
                                    }`}
                                    onClick={() => navigate(`/food/${relatedFood._id || relatedFood.id}`)}
                                >
                                    {/* AI Badge */}
                                    {aiServiceAvailable && relatedFood.aiScore && (
                                        <div className="relative">
                                            <div className="absolute top-2 left-2 z-10">
                                                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                    🤖 AI {Math.round(relatedFood.aiScore * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <img
                                        src={relatedFood.image}
                                        alt={relatedFood.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-2">{relatedFood.name}</h3>
                                        <p className="text-red-600 font-bold text-xl mb-2">
                                            {relatedFood.price.toLocaleString("vi-VN")}đ
                                        </p>
                                        <p className="text-gray-600 text-sm line-clamp-2">{relatedFood.description}</p>

                                        {/* AI Reason */}
                                        {aiServiceAvailable && relatedFood.aiReason && (
                                            <p className="text-xs text-purple-600 italic mt-2 bg-purple-50 rounded p-2">
                                                💡 {relatedFood.aiReason}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FoodDetail;
