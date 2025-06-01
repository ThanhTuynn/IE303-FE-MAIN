import React, { useState, useEffect } from "react";
import {
    FaSearch,
    FaHeart,
    FaBreadSlice,
    FaUtensils,
    FaConciergeBell,
    FaDrumstickBite,
    FaHamburger,
    FaCoffee,
    FaMinus,
    FaPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Favourite = () => {
    const navigate = useNavigate();
    const [allFoods, setAllFoods] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [search, setSearch] = useState("");
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        const userData = localStorage.getItem("userData");

        if (!token || !userData) {
            alert("Please log in to view your favourite items.");
            navigate("/login");
            return;
        }

        try {
            const user = JSON.parse(userData);
            setUserId(user.id);
        } catch (e) {
            console.error("Failed to parse user data from localStorage:", e);
            alert("Error retrieving user data. Please log in again.");
            navigate("/login");
            return;
        }

        const fetchFoodsAndFavourites = async (id, authToken) => {
            try {
                setLoading(true);
                const foodsResponse = await axios.get("http://localhost:8080/api/foods");
                const allFoodItems = foodsResponse.data;
                console.log("Fetched all foods:", allFoodItems);
                setAllFoods(allFoodItems);

                const favouritesResponse = await axios.get(`http://localhost:8080/api/users/${id}/favourites`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                const favouriteFoodIds = favouritesResponse.data;
                console.log("Fetched favourite food IDs:", favouriteFoodIds);

                const favoriteFoodObjects = allFoodItems.filter((food) => {
                    const foodIdString = String(food.id);
                    console.log(
                        `Checking if food ID ${foodIdString} is in favorites: ${favouriteFoodIds.includes(
                            foodIdString
                        )}`
                    );
                    return favouriteFoodIds.includes(foodIdString);
                });
                console.log("Filtered favourite food objects:", favoriteFoodObjects);
                setFavourites(favoriteFoodObjects);

                const initialQuantities = {};
                favoriteFoodObjects.forEach((food) => {
                    initialQuantities[food.id] = 0;
                });
                setQuantities(initialQuantities);

                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
                console.error("Error fetching foods or favorites:", err);
                alert("Failed to fetch favourite items.");
            }
        };

        if (userId) {
            fetchFoodsAndFavourites(userId, token);
        }
    }, [userId, navigate]);

    const toggleFavourite = async (foodId) => {
        const token = localStorage.getItem("jwtToken");
        if (!token || !userId) {
            alert("Please log in to remove items from your favourites.");
            navigate("/login");
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/api/users/${userId}/favourites/${foodId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFavourites((prev) => prev.filter((food) => food.id !== foodId));
            alert("Đã xoá khỏi danh sách yêu thích!");
        } catch (err) {
            console.error("Error removing from favorites:", err);
            alert("Failed to remove from favorites.");
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

                // Trigger custom event to update header cart count
                window.dispatchEvent(new Event("cartUpdated"));
            } catch (err) {
                console.error("Error adding item to cart:", err);
                alert("Failed to add item to cart.");
            }
        } else if (quantity === 0) {
            alert("Please select a quantity greater than 0.");
        }
    };

    const filteredFavourites = favourites.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

    if (loading) {
        return <div className="text-center py-8">Loading favourite items...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">Error loading favourite items: {error.message}</div>;
    }

    if (!loading && !error && favourites.length === 0) {
        return (
            <div className="text-center py-10 font-kanit">
                <h1 className="text-4xl md:text-5xl font-extrabold text-red-600 mb-4">CHƯA CÓ MÓN YÊU THÍCH NÀO</h1>
                <p className="text-gray-700 mb-6">
                    Hãy khám phá menu và thêm những món bạn thích vào danh sách yêu thích nhé!
                </p>
                <button
                    onClick={() => navigate("/menu")}
                    className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition duration-300"
                >
                    Đến Menu
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white text-black font-kanit px-4 md:px-8 lg:px-16 py-10 zoom-75">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-red-600">
                    MÓN NGON YÊU THÍCH <span className="text-black">CỦA BẠN</span>
                </h1>

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

            <section className="mb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredFavourites.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            onClick={() => navigate(`/food/${item._id || item.id}`)}
                        >
                            <div className="relative">
                                <button
                                    className="absolute top-3 right-3 text-2xl focus:outline-none z-10"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavourite(item.id);
                                    }}
                                >
                                    <FaHeart className="text-2xl text-red-600 transition-colors" />
                                </button>
                                <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                            </div>

                            <div className="p-4">
                                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">{item.name}</h3>
                                <p className="text-red-600 font-bold text-xl mb-3">
                                    {item.price?.toLocaleString("vi-VN")}đ
                                </p>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{item.desc}</p>

                                {/* Action Row - Updated to match Menu page design */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleChange(item.id, -1);
                                            }}
                                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-l-lg transition-colors"
                                            disabled={(quantities[item.id] || 0) <= 0}
                                        >
                                            <FaMinus size={12} />
                                        </button>
                                        <span className="w-12 h-8 flex items-center justify-center text-gray-800 font-semibold bg-gray-50">
                                            {quantities[item.id] || 0}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleChange(item.id, 1);
                                            }}
                                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-r-lg transition-colors"
                                        >
                                            <FaPlus size={12} />
                                        </button>
                                    </div>
                                    <button
                                        disabled={(quantities[item.id] || 0) === 0 || !userId}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart(item);
                                        }}
                                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                                            (quantities[item.id] || 0) === 0 || !userId
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
        </div>
    );
};

export default Favourite;
