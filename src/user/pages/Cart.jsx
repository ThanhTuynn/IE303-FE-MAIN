import React, { useState, useEffect } from "react";
import { Trash, CheckSquare, Square, ShoppingBag, Heart, Clock, ArrowRight, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PaymentButton from "../components/PaymentButton";
import EnhancedPaymentButton from "../components/EnhancedPaymentButton";
import { getUserFromLocalStorage, getTokenFromLocalStorage } from "../utils/localStorage";

const Cart = () => {
    const [items, setItems] = useState([]);
    const [discountCode, setDiscountCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Customer info from localStorage
    const customerInfo = (() => {
        try {
            const user = getUserFromLocalStorage();
            if (user) {
                return {
                    name: user.fullName || user.name || "Khách hàng",
                    email: user.email || "",
                    phone: user.phone || "",
                };
            }
        } catch (e) {
            console.error("Failed to parse user data:", e);
        }
        return {
            name: "Khách hàng",
            email: "",
            phone: "",
        };
    })();

    // Get user info from localStorage
    useEffect(() => {
        const token = getTokenFromLocalStorage();
        const user = getUserFromLocalStorage();

        if (token && user) {
            setUserId(user.id || user._id);
            setIsLoggedIn(true);
            console.log("Cart - User logged in:", user);
        } else {
            setIsLoggedIn(false);
            console.warn("Cart - No user data found, user may need to login");
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchCart();
        }
    }, [userId]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            if (userId) {
                const response = await axios.get(`http://localhost:8080/api/carts/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${getTokenFromLocalStorage()}`,
                    },
                });
                console.log("Cart data received:", response.data);
                setItems(response.data.items);
            }
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
            console.error("Error fetching cart:", err);
        }
    };

    const handleQuantityChange = async (id, delta) => {
        const token = getTokenFromLocalStorage();
        // Optimistically update the state
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.foodId === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
            )
        );

        const currentItem = items.find((item) => item.foodId === id);
        if (!currentItem) return;

        const newQuantity = Math.max(1, currentItem.quantity + delta);

        if (!userId || !token) {
            console.warn("User not logged in. Cannot update cart.");
            return;
        }

        try {
            await axios.put(`http://localhost:8080/api/carts/${userId}/items/${id}?quantity=${newQuantity}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(`Quantity updated for foodId ${id} to ${newQuantity}`);
        } catch (err) {
            console.error("Error updating quantity on backend:", err);
            // Revert the optimistic update on error
            setItems((prevItems) =>
                prevItems.map((item) => (item.foodId === id ? { ...item, quantity: currentItem.quantity } : item))
            );
        }
    };

    const handleCheckboxChange = (id) => {
        setItems((prevItems) =>
            prevItems.map((item) => (item.foodId === id ? { ...item, checked: !item.checked } : item))
        );
    };

    const handleRemoveItem = async (id) => {
        const token = getTokenFromLocalStorage();

        if (!userId || !token) {
            console.warn("User not logged in. Cannot remove item.");
            return;
        }

        try {
            // Optimistically remove from UI
            setItems((prevItems) => prevItems.filter((item) => item.foodId !== id));

            // Remove from server
            await axios.delete(`http://localhost:8080/api/carts/${userId}/items/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(`Item ${id} removed from cart successfully`);
        } catch (err) {
            console.error("Error removing item from cart:", err);
            // Refresh cart to restore correct state
            fetchCart();
        }
    };

    const handleDiscountApply = () => {
        if (discountCode === "DISCOUNT20") {
            setDiscount(20000);
        } else if (discountCode === "WELCOME10") {
            setDiscount(10000);
        } else if (discountCode === "SAVE5") {
            setDiscount(5000);
        } else {
            setDiscount(0);
        }
    };

    const totalPrice = items.reduce((total, item) => (item.checked ? total + item.price * item.quantity : total), 0);
    const finalAmount = Math.max(0, totalPrice - discount);
    const selectedItems = items.filter((item) => item.checked);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Đang tải giỏ hàng...</p>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center font-kanit">
                <div className="text-center bg-white rounded-3xl shadow-2xl p-12 max-w-md mx-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag size={48} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Giỏ hàng trống</h2>
                    <p className="text-gray-600 mb-8">Hãy thêm sản phẩm yêu thích vào giỏ hàng nhé!</p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                        Khám phá món ngon
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 font-kanit">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
                        Giỏ hàng của bạn
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items - Left Side */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <ShoppingBag className="text-white" size={28} />
                                        <h2 className="text-2xl font-bold text-white">Món ăn đã chọn</h2>
                                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                                            {items.length} món
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => navigate("/order-history")}
                                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2"
                                    >
                                        <Clock size={16} />
                                        <span>Lịch sử</span>
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {items.map((item, index) => (
                                    <div
                                        key={item.foodId}
                                        className={`group relative bg-gradient-to-r from-gray-50 to-orange-50 rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                                            item.checked
                                                ? "border-red-300 bg-gradient-to-r from-red-50 to-orange-50"
                                                : "border-gray-200 hover:border-orange-300"
                                        }`}
                                        style={{
                                            animationDelay: `${index * 100}ms`,
                                            animation: "fadeInUp 0.6s ease-out forwards",
                                        }}
                                    >
                                        <div className="flex items-center space-x-4">
                                            {/* Checkbox */}
                                            <div
                                                onClick={() => handleCheckboxChange(item.foodId)}
                                                className="cursor-pointer p-1 hover:bg-white/50 rounded-lg transition-colors"
                                            >
                                                {item.checked ? (
                                                    <CheckSquare size={24} className="text-red-500" />
                                                ) : (
                                                    <Square size={24} className="text-gray-400 hover:text-red-400" />
                                                )}
                                            </div>

                                            {/* Product Image */}
                                            <div className="relative">
                                                <img
                                                    src={item.imageUrl || item.image}
                                                    alt={item.name}
                                                    className="w-20 h-20 object-cover rounded-xl shadow-md"
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "https://via.placeholder.com/80x80?text=No+Image";
                                                    }}
                                                />
                                                {item.checked && (
                                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-xs font-bold">✓</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                    {item.name}
                                                </h3>
                                                <p className="text-2xl font-bold text-red-600">
                                                    {(item.price * item.quantity).toLocaleString()}đ
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {item.price.toLocaleString()}đ / món
                                                </p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center space-x-3 bg-white rounded-full p-2 shadow-md">
                                                <button
                                                    onClick={() => handleQuantityChange(item.foodId, -1)}
                                                    className="w-10 h-10 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    −
                                                </button>
                                                <span className="w-8 text-center text-lg font-bold text-gray-800">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.foodId, 1)}
                                                    className="w-10 h-10 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => handleRemoveItem(item.foodId)}
                                                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300 hover:scale-110"
                                                title="Xóa khỏi giỏ hàng"
                                            >
                                                <Trash size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary - Right Side */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden sticky top-8">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
                                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                                    <Tag className="text-white" size={24} />
                                    <span>Tóm tắt đơn hàng</span>
                                </h2>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Discount Code */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700">Mã giảm giá</label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            placeholder="Nhập mã giảm giá"
                                            value={discountCode}
                                            onChange={(e) => setDiscountCode(e.target.value)}
                                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                        />
                                        <button
                                            onClick={handleDiscountApply}
                                            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
                                        >
                                            Áp dụng
                                        </button>
                                    </div>
                                    {/* Suggested discount codes */}
                                    <div className="text-xs text-gray-500 space-y-1">
                                        <p>
                                            💡 Thử: <code className="bg-gray-100 px-2 py-1 rounded">DISCOUNT20</code>,{" "}
                                            <code className="bg-gray-100 px-2 py-1 rounded">WELCOME10</code>
                                        </p>
                                    </div>
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-4 bg-gray-50 rounded-xl p-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tổng đơn hàng ({selectedItems.length} món)</span>
                                        <span className="font-medium">{totalPrice.toLocaleString()}đ</span>
                                    </div>

                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Giảm giá</span>
                                            <span className="font-medium">-{discount.toLocaleString()}đ</span>
                                        </div>
                                    )}

                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between text-xl font-bold text-gray-800">
                                            <span>Tổng thanh toán</span>
                                            <span className="text-red-600">{finalAmount.toLocaleString()}đ</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Selected Items Preview */}
                                {selectedItems.length > 0 && (
                                    <div className="bg-blue-50 rounded-xl p-4">
                                        <h4 className="font-medium text-blue-800 mb-2">
                                            Món đã chọn ({selectedItems.length})
                                        </h4>
                                        <div className="space-y-1 text-sm text-blue-700">
                                            {selectedItems.slice(0, 3).map((item) => (
                                                <div key={item.foodId} className="flex justify-between">
                                                    <span>
                                                        {item.name} x{item.quantity}
                                                    </span>
                                                    <span>{(item.price * item.quantity).toLocaleString()}đ</span>
                                                </div>
                                            ))}
                                            {selectedItems.length > 3 && (
                                                <p className="text-blue-600 italic">
                                                    ... và {selectedItems.length - 3} món khác
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Checkout Button */}
                                {selectedItems.length > 0 && finalAmount > 0 ? (
                                    <button
                                        onClick={() => {
                                            navigate("/payment", {
                                                state: {
                                                    cartItems: selectedItems,
                                                    totalAmount: finalAmount,
                                                    originalTotal: totalPrice,
                                                    discount: discount,
                                                    customerInfo: customerInfo,
                                                    userId: userId,
                                                },
                                            });
                                        }}
                                        className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-4 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                                    >
                                        <span>Tiếp tục đặt hàng</span>
                                        <ArrowRight size={20} />
                                    </button>
                                ) : (
                                    <div className="text-center bg-gray-50 rounded-2xl p-6">
                                        <Heart className="mx-auto text-gray-400 mb-3" size={32} />
                                        <p className="text-gray-500 mb-4">
                                            {selectedItems.length === 0
                                                ? "Hãy chọn món ăn để tiếp tục"
                                                : "Không có sản phẩm hợp lệ"}
                                        </p>
                                        <button
                                            onClick={() => navigate("/")}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-xl transition-colors"
                                        >
                                            Khám phá thêm
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add CSS Animation */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .group:hover .group-hover\\:scale-110 {
                    transform: scale(1.1);
                }
            `}</style>
        </div>
    );
};

export default Cart;
