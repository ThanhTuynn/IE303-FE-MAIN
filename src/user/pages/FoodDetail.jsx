import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import aiRecommendationService from "../services/aiRecommendationService";
import { toast } from "../components/Toast";

const FoodDetail = () => {
    const { foodId } = useParams();
    const navigate = useNavigate();

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

                console.log("🍔 Fetching food detail for ID:", foodId);
                console.log("🍔 ID type:", foodId.length > 10 ? "Likely ObjectId" : "Likely numeric ID");

                // Try with the provided ID first (should work for both ObjectId and numeric)
                let response;
                try {
                    response = await axios.get(`http://localhost:8080/api/foods/${foodId}`);
                    console.log("✅ Successfully fetched food:", response.data);
                    console.log("✅ Food has ObjectId (_id):", response.data._id);
                    console.log("✅ Food has numeric id:", response.data.id);
                } catch (error) {
                    if (error.response?.status === 404) {
                        console.log("⚠️ Food not found with direct ID, trying to find in foods list...");
                        // Try to find food by numeric id from the foods list
                        const allFoodsResponse = await axios.get("http://localhost:8080/api/foods");
                        const foundFood = allFoodsResponse.data.find(
                            (food) => food.id === parseInt(foodId) || food._id === foodId
                        );

                        if (foundFood) {
                            response = { data: foundFood };
                            console.log("✅ Found food in list:", foundFood);
                        } else {
                            throw new Error("Food not found");
                        }
                    } else {
                        throw error;
                    }
                }

                setFood(response.data);

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
            toast.warning("Vui lòng đăng nhập để thêm vào yêu thích!");
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
                toast.success("Đã xóa khỏi danh sách yêu thích!");
            } else {
                // Add to favorites
                await axios.post(
                    `http://localhost:8080/api/users/${userId}/favourites`,
                    { foodId: foodIdToUse },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setIsFavorite(true);
                toast.success("Đã thêm vào danh sách yêu thích!");
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
            toast.error("Có lỗi xảy ra khi cập nhật yêu thích!");
        }
    };

    // Handle add to cart
    const handleAddToCart = async () => {
        if (!isLoggedIn || !userId) {
            toast.warning("Vui lòng đăng nhập để thêm vào giỏ hàng!");
            navigate("/login");
            return;
        }

        const token = localStorage.getItem("jwtToken");
        const foodIdToUse = food._id || food.id;

        console.log("🛒 Adding to cart:", {
            userId: userId,
            foodId: foodIdToUse,
            foodName: food.name,
            quantity: quantity,
            price: food.price,
            specialInstructions: specialInstructions,
            preferredIdType: food._id ? "ObjectId (_id)" : "Numeric (id)",
        });

        try {
            const requestData = {
                foodId: foodIdToUse,
                quantity: quantity,
                specialInstructions: specialInstructions || "",
            };

            console.log("🛒 Request data:", requestData);
            console.log("🛒 API URL:", `http://localhost:8080/api/carts/${userId}/items`);

            const response = await axios.post(`http://localhost:8080/api/carts/${userId}/items`, requestData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("✅ Cart add response:", response.data);
            toast.success(`Đã thêm ${quantity} ${food.name} vào giỏ hàng!`);

            // Reset form
            setQuantity(1);
            setSpecialInstructions("");
        } catch (error) {
            console.error("❌ Error adding to cart:", error);
            console.error("❌ Error response:", error.response?.data);
            console.error("❌ Error status:", error.response?.status);
            toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng!");
        }
    };

    // Handle buy now
    const handleBuyNow = () => {
        if (!isLoggedIn) {
            toast.warning("Vui lòng đăng nhập để mua hàng!");
            navigate("/login");
            return;
        }

        // Add to cart first, then navigate to payment
        handleAddToCart();
        setTimeout(() => {
            navigate("/cart");
        }, 1000); // Wait for toast to show
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Mô tả sản phẩm</h2>

                    {/* Main Description */}
                    <div className="mb-8">
                        <p className="text-gray-700 leading-relaxed text-lg">
                            {food.description ||
                                "Món ăn ngon với hương vị tuyệt vời từ UniFoodie, được chế biến từ nguyên liệu tươi ngon và công thức truyền thống."}
                        </p>
                    </div>

                    {/* Food Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Product Details */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <span className="mr-2">📋</span>
                                Chi tiết sản phẩm
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                    <span className="font-medium text-gray-700 flex items-center">
                                        <span className="mr-2">🏷️</span>
                                        Danh mục
                                    </span>
                                    <span className="text-gray-800 font-semibold bg-blue-100 px-3 py-1 rounded-full text-sm">
                                        {food.category || "Đặc sản"}
                                    </span>
                                </div>

                                {food.rating && (
                                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                        <span className="font-medium text-gray-700 flex items-center">
                                            <span className="mr-2">⭐</span>
                                            Đánh giá
                                        </span>
                                        <span className="text-gray-800 font-semibold">{food.rating} / 5 sao</span>
                                    </div>
                                )}

                                {food.calories && (
                                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                        <span className="font-medium text-gray-700 flex items-center">
                                            <span className="mr-2">🔥</span>
                                            Calories
                                        </span>
                                        <span className="text-gray-800 font-semibold">{food.calories} kcal</span>
                                    </div>
                                )}

                                {food.prepTime && (
                                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                        <span className="font-medium text-gray-700 flex items-center">
                                            <span className="mr-2">🕒</span>
                                            Thời gian chuẩn bị
                                        </span>
                                        <span className="text-gray-800 font-semibold">{food.prepTime}</span>
                                    </div>
                                )}

                                {food.spiceLevel && (
                                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                        <span className="font-medium text-gray-700 flex items-center">
                                            <span className="mr-2">🌶️</span>
                                            Độ cay
                                        </span>
                                        <span className="text-gray-800 font-semibold">{food.spiceLevel}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                    <span className="font-medium text-gray-700 flex items-center">
                                        <span className="mr-2">🛡️</span>
                                        Tình trạng
                                    </span>
                                    <span className="text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full text-sm">
                                        Còn hàng
                                    </span>
                                </div>

                                <div className="flex justify-between items-center py-3">
                                    <span className="font-medium text-gray-700 flex items-center">
                                        <span className="mr-2">✅</span>
                                        Chất lượng
                                    </span>
                                    <span className="text-blue-600 font-semibold">Tươi ngon, an toàn</span>
                                </div>
                            </div>

                            {/* Nutritional Benefits */}
                            <div className="mt-8">
                                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                    <span className="mr-2">💪</span>
                                    Lợi ích dinh dưỡng
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className="mr-2">✨</span>
                                        <span>Cung cấp năng lượng cho cơ thể</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className="mr-2">✨</span>
                                        <span>Giàu vitamin và khoáng chất</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className="mr-2">✨</span>
                                        <span>Phù hợp cho mọi lứa tuổi</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quality Assurance */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
                                    <span className="mr-2">🏆</span>
                                    Cam kết chất lượng
                                </h4>
                                <div className="space-y-1 text-sm text-blue-700">
                                    <div className="flex items-center">
                                        <span className="mr-2">🔸</span>
                                        <span>Nguyên liệu được chọn lọc kỹ càng</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="mr-2">🔸</span>
                                        <span>Chế biến theo tiêu chuẩn vệ sinh thực phẩm</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="mr-2">🔸</span>
                                        <span>Đảm bảo hương vị ngon nhất khi giao hàng</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Ingredients */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <span className="mr-2">🥘</span>
                                Nguyên liệu chính
                            </h3>

                            {food.ingredients && food.ingredients.length > 0 ? (
                                <div className="grid grid-cols-1 gap-2">
                                    {(Array.isArray(food.ingredients)
                                        ? food.ingredients
                                        : food.ingredients.split(", ")
                                    ).map((ingredient, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center py-2 px-3 bg-green-50 rounded-lg border border-green-200"
                                        >
                                            <span className="mr-2 text-green-600">🌿</span>
                                            <span className="text-gray-700 font-medium">{ingredient.trim()}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex items-center py-2 px-3 bg-green-50 rounded-lg border border-green-200">
                                        <span className="mr-2 text-green-600">🌿</span>
                                        <span className="text-gray-700 font-medium">Nguyên liệu tươi ngon</span>
                                    </div>
                                    <div className="flex items-center py-2 px-3 bg-green-50 rounded-lg border border-green-200">
                                        <span className="mr-2 text-green-600">🌿</span>
                                        <span className="text-gray-700 font-medium">Gia vị đậm đà</span>
                                    </div>
                                    <div className="flex items-center py-2 px-3 bg-green-50 rounded-lg border border-green-200">
                                        <span className="mr-2 text-green-600">🌿</span>
                                        <span className="text-gray-700 font-medium">
                                            Chế biến theo công thức truyền thống
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
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
