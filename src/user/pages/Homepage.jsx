import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls

const Homepage = () => {
    const [quantities, setQuantities] = useState({}); // Change to object to store quantities by food ID
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [foods, setFoods] = useState([]); // State to store fetched food data
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState(null); // State to track any errors
    const [userId, setUserId] = useState(null); // State to store the user ID

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        setIsLoggedIn(!!token);

        // Get user data from localStorage and set userId
        const userData = localStorage.getItem('userData');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                setUserId(user.id); // Assuming user ID is stored as 'id'
            } catch (e) {
                console.error("Failed to parse user data from localStorage:", e);
            }
        }

        // Fetch food data from the backend
        const fetchFoods = async () => {
            try {
                // Replace with your backend API URL
                const response = await axios.get('http://localhost:8080/api/foods');
                setFoods(response.data);
                // Initialize quantities state based on fetched foods
                const initialQuantities = {};
                response.data.forEach(food => {
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

    const handleChange = (foodId, delta) => {
        setQuantities((prev) => {
            const updated = { ...prev };
            updated[foodId] = Math.max(0, (updated[foodId] || 0) + delta);
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
                const itemToAdd = {
                    foodId: food.id,
                    name: food.name,
                    price: food.price,
                    quantity: quantity,
                    imageUrl: food.image // Assuming 'image' field from backend corresponds to imageUrl
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
        } else if (!userId) {
             // This case is now handled by the initial token check
             alert("Please log in to add items to your cart.");
             navigate('/login');
        }
    };

    const handleLoginClick = () => {
        navigate('/login');
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
                {!isLoggedIn && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <button
                            onClick={handleLoginClick}
                            className="bg-red-600 hover:bg-red-700 text-white text-xl md:text-2xl font-bold py-3 px-8 rounded-full shadow-lg transition-colors duration-300"
                        >
                            ĐĂNG NHẬP NGAY
                        </button>
                    </div>
                )}
            </section>

            {/* Gợi ý cho bạn */}
            <section className="container-custom py-16 bg-white">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-center mb-12">
                    <span className="text-red-600">CÓ THỂ</span> BẠN SẼ THÍCH
                </h2>

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
                    {foods.map((food) => ( // Use fetched foods data
                        <SwiperSlide key={food.id}> 
                            <div className="product-card">
                                <img src={food.image} alt={food.name} className="product-image" />
                                <h3 className="product-title">{food.name}</h3>
                                {/* Assuming price is stored as a number and needs formatting */}
                                <p className="product-price">{food.price.toLocaleString('vi-VN')}đ</p>
                                <p className="product-description">{food.description}</p>
                                <div className="flex justify-between items-center gap-4">
                                    <div className="quantity-control">
                                        <button
                                            onClick={() => handleChange(food.id, -1)} // Pass food.id
                                            className="quantity-btn"
                                            disabled={(quantities[food.id] || 0) <= 0} // Use quantity from state
                                        >
                                            −
                                        </button>
                                        <span className="quantity-display">{quantities[food.id] || 0}</span>
                                        <button onClick={() => handleChange(food.id, 1)} className="quantity-btn">
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleAddToCart(food)} 
                                        disabled={(quantities[food.id] || 0) === 0 || !userId} // Disable if quantity is 0 or not logged in
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
            </section>

            {/* Thực đơn */}
            <section className="container-custom py-16 bg-gray-50">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                        THỰC ĐƠN CỦA <span className="text-gradient-red">UNIFOODIE</span>
                    </h2>
                    <p className="text-base md:text-lg max-w-4xl mx-auto leading-relaxed text-gray-600">
                        Những món ăn tươi ngon với hương vị tuyệt vời đến từ{" "}
                        <span className="font-semibold text-red-600">UniFoodie</span> chắc chắn sẽ không làm bạn thất
                        vọng. Chọn món và nhấn đặt hàng, shipper nhà UniFoodie sẽ giao ngay món ăn đến tay bạn trong
                        thời gian nhanh nhất!!!
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
