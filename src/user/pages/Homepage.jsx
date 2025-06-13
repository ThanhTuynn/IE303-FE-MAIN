import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API calls
import aiRecommendationService from "../services/aiRecommendationService"; // Import AI service
import { toast } from "../components/Toast";

const Homepage = () => {
  const [quantities, setQuantities] = useState({}); // Change to object to store quantities by food ID
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [foods, setFoods] = useState([]); // State to store fetched food data
  const [recommendedFoods, setRecommendedFoods] = useState([]); // State for AI recommended foods
  const [loading, setLoading] = useState(true); // State to track loading status
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [error, setError] = useState(null); // State to track any errors
  const [userId, setUserId] = useState(null); // State to store the user ID
  const [aiServiceAvailable, setAiServiceAvailable] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setIsLoggedIn(!!token);

    // Get user data from localStorage and set userId
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserId(user.id || user._id); // Support both id formats
        console.log("👤 User logged in:", user);
      } catch (e) {
        console.error("Failed to parse user data from localStorage:", e);
      }
    }

    // Fetch food data from the backend
    const fetchFoods = async () => {
      try {
        // Replace with your backend API URL
        const response = await axios.get("http://localhost:8080/api/foods");
        setFoods(response.data);
        // Initialize quantities state based on fetched foods
        const initialQuantities = {};
        response.data.forEach((food) => {
          initialQuantities[food.id] = 0;
        });
        setQuantities(initialQuantities);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        console.error("Error fetching foods:", err);
      }
    };

    fetchFoods();
  }, []);

  // Fetch AI recommendations when user is logged in
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userId || !isLoggedIn) {
        console.log("👤 User not logged in, skipping AI recommendations");
        setRecommendedFoods([]);
        setRecommendationsLoading(false);
        return;
      }

      try {
        setRecommendationsLoading(true);

        console.log("🤖 Fetching AI recommendations for user:", userId);
        const result =
          await aiRecommendationService.getUserBasedRecommendations(userId);

        if (result.success && result.data && result.data.length > 0) {
          console.log("✅ AI recommendations received:", result.data);
          setAiServiceAvailable(true);

          // Match recommended food IDs with actual food data
          const matchedRecommendations = result.data
            .map((rec) => {
              const food = foods.find(
                (f) => f.id === rec.food_id || f.id === rec.id
              );
              if (food) {
                return {
                  ...food,
                  aiScore: rec.score || rec.confidence || 1,
                  // aiReason: rec.reason || "Recommended based on your order history",
                };
              }
              return null;
            })
            .filter(Boolean) // Remove null entries
            .slice(0, 6); // Limit to 6 items

          setRecommendedFoods(matchedRecommendations);
          console.log("🎯 Matched recommendations:", matchedRecommendations);
        } else {
          console.log("ℹ️ No AI recommendations found, using popular foods");
          setAiServiceAvailable(false);
          // Fallback to popular foods
          setRecommendedFoods(foods.slice(0, 6));
        }
      } catch (error) {
        console.error("❌ Error fetching AI recommendations:", error);
        setAiServiceAvailable(false);
        // Fallback to showing some foods
        setRecommendedFoods(foods.slice(0, 6));
      } finally {
        setRecommendationsLoading(false);
      }
    };

    // Only fetch recommendations after foods are loaded
    if (foods.length > 0) {
      fetchRecommendations();
    }
  }, [userId, isLoggedIn, foods]);

  const handleChange = (foodId, delta) => {
    setQuantities((prev) => {
      const updated = { ...prev };
      updated[foodId] = Math.max(0, (updated[foodId] || 0) + delta);
      return updated;
    });
  };

  const handleAddToCart = async (food) => {
    const quantity = quantities[food.id];
    const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage

    if (!token) {
      toast.warning("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      navigate("/login");
      return; // Stop if not logged in
    }

    if (quantity > 0 && userId) {
      try {
        const itemToAdd = {
          foodId: food.id,
          name: food.name,
          price: food.price,
          quantity: quantity,
          imageUrl: food.image, // Assuming 'image' field from backend corresponds to imageUrl
        };

        // Make the API call to add item to cart with Authorization header
        const response = await axios.post(
          `http://localhost:8080/api/carts/${userId}/items`,
          itemToAdd,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the JWT token
            },
          }
        );
        console.log("Item added to cart:", response.data);
        toast.success(`Đã thêm ${quantity} ${food.name} vào giỏ hàng!`);

        // Optionally reset the quantity counter after adding to cart
        setQuantities((prev) => ({ ...prev, [food.id]: 0 }));

        // Trigger custom event to update header cart count
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (err) {
        console.error("Error adding item to cart:", err);
        toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng!");
      }
    } else if (quantity === 0) {
      toast.warning("Vui lòng chọn số lượng lớn hơn 0!");
    } else if (!userId) {
      // This case is now handled by the initial token check
      toast.warning("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      navigate("/login");
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  // if (loading) {
  //     return <div>Loading foods...</div>; // Basic loading indicator
  // }

  if (error) {
    return <div>Error loading foods: {error.message}</div>; // Basic error handling
  }

  return (
    <div className="bg-gray-50 text-gray-900 font-kanit min-h-screen">
      {/* Banner */}
      <section className="w-full relative">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          navigation={true}
          className="w-full h-[400px] md:h-[500px] lg:h-[600px]"
        >
          <SwiperSlide>
            <img
              src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746382142/i_m_avery_davis_4_pplo4x.png"
              alt="Banner 1"
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://res.cloudinary.com/dbr85jktp/image/upload/v1747665970/2_hsx5dk.png"
              alt="Banner 2"
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://res.cloudinary.com/dbr85jktp/image/upload/v1747665969/1_lcwn2n.png"
              alt="Banner 3"
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        </Swiper>

        {/* Login CTA Button (visible only if not logged in)*/}
        {/* Removed login button overlay */}
      </section>

      {/* Gợi ý cho bạn */}
      <section className="container-custom py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
            <span className="text-red-600">CÓ THỂ</span> BẠN SẼ THÍCH
          </h2>

          {/* AI Status Badge */}
          {/* {isLoggedIn && (
                        <div className="flex justify-center mb-4">
                            {aiServiceAvailable ? (
                                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                                    🤖 Được đề xuất bởi AI dựa trên lịch sử đặt hàng
                                </span>
                            ) : (
                                <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                                    ⭐ Món ăn phổ biến (AI tạm thời không khả dụng)
                                </span>
                            )}
                        </div>
                    )} */}

          {!isLoggedIn && (
            <p className="text-gray-600 text-sm mb-4">
              Đăng nhập để nhận gợi ý món ăn cá nhân hóa từ AI
            </p>
          )}
        </div>

        {/* Loading State */}
        {recommendationsLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <span className="text-gray-600">
                {isLoggedIn
                  ? "Đang tìm món ăn phù hợp với bạn..."
                  : "Đang tải món ăn..."}
              </span>
            </div>
          </div>
        ) : recommendedFoods.length === 0 ? (
          /* No recommendations */
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {isLoggedIn
                ? "Chưa có đủ dữ liệu để đề xuất"
                : "Hãy đăng nhập để nhận gợi ý"}
            </h3>
            <p className="text-gray-600 mb-6">
              {isLoggedIn
                ? "Hãy đặt một vài món để AI có thể học sở thích của bạn!"
                : "Đăng nhập để AI gợi ý những món ăn phù hợp với sở thích của bạn."}
            </p>
            {!isLoggedIn && (
              <button
                onClick={handleLoginClick}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Đăng nhập ngay
              </button>
            )}
          </div>
        ) : (
          /* Display Recommendations */
          <Swiper
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 32 },
            }}
            className="px-4"
          >
            {recommendedFoods.map((food) => (
              <SwiperSlide key={food.id}>
                <div
                  className="product-card relative cursor-pointer"
                  onClick={() => navigate(`/food/${food._id || food.id}`)}
                >
                  {/* AI Badge for recommended items */}
                  {aiServiceAvailable && food.aiScore && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        🤖 AI
                      </span>
                    </div>
                  )}

                  <img
                    src={food.image}
                    alt={food.name}
                    className="product-image"
                  />
                  <h3 className="product-title">{food.name}</h3>
                  <p className="product-price">
                    {food.price.toLocaleString("vi-VN")}đ
                  </p>
                  <p className="product-description">{food.description}</p>

                  {/* AI Reason (if available) */}
                  {aiServiceAvailable && food.aiReason && (
                    <p className="text-xs text-purple-600 italic mb-2 px-2">
                      💡 {food.aiReason}
                    </p>
                  )}

                  <div className="flex justify-between items-center gap-4">
                    <div className="quantity-control">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChange(food.id, -1);
                        }}
                        className="quantity-btn"
                        disabled={(quantities[food.id] || 0) <= 0}
                      >
                        −
                      </button>
                      <span className="quantity-display">
                        {quantities[food.id] || 0}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChange(food.id, 1);
                        }}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(food);
                      }}
                      disabled={(quantities[food.id] || 0) === 0 || !userId}
                      className={`px-4 py-2 text-sm rounded-lg font-semibold transition-all duration-300 ${
                        (quantities[food.id] || 0) === 0 || !userId
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "btn-primary"
                      }`}
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>

      {/* Thực đơn */}
      <section className="container-custom py-16 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            THỰC ĐƠN CỦA <span className="text-gradient-red">UNIFOODIE</span>
          </h2>
          <p className="text-base md:text-lg max-w-4xl mx-auto leading-relaxed text-gray-600">
            Những món ăn tươi ngon với hương vị tuyệt vời đến từ{" "}
            <span className="font-semibold text-red-600">UniFoodie</span> chắc
            chắn sẽ không làm bạn thất vọng. Chọn món và nhấn đặt hàng, shipper
            nhà UniFoodie sẽ giao ngay món ăn đến tay bạn trong thời gian nhanh
            nhất!!!
          </p>
        </div>

        {/* Danh mục món ăn */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="menu-category">
            <img
              src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746382658/2_bqzn16.svg"
              alt="Bữa sáng tiện lợi"
              className="w-full h-auto"
            />
          </div>
          <div className="menu-category">
            <img
              src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746382658/4_zjill3.svg"
              alt="Bữa trưa dinh dưỡng"
              className="w-full h-auto"
            />
          </div>
          <div className="menu-category">
            <img
              src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746382657/5_r48q1e.svg"
              alt="UniFoodie Snack Bar"
              className="w-full h-auto"
            />
          </div>
          <div className="menu-category">
            <img
              src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746382659/6_wwzmb3.svg"
              alt="Ưu đãi nóng hổi"
              className="w-full h-auto"
            />
          </div>
          <div className="menu-category">
            <img
              src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746382658/1_xq9gqt.svg"
              alt="Đồ uống tươi mát"
              className="w-full h-auto"
            />
          </div>
          <div className="menu-category">
            <img
              src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746382660/3_ieusfb.svg"
              alt="Combo tiện lợi"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
