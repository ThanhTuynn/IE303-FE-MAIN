import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = ({ userId }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, [userId]);

    const fetchCart = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/cart?userId=${userId}`);
            setCart(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching cart:", error);
            setLoading(false);
        }
    };

    const updateQuantity = async (foodId, newQuantity) => {
        try {
            const response = await axios.put(
                `http://localhost:8080/api/cart/items/${foodId}?userId=${userId}&quantity=${newQuantity}`
            );
            setCart(response.data);
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const removeItem = async (foodId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/cart/items/${foodId}?userId=${userId}`);
            setCart(response.data);
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const clearCart = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/cart?userId=${userId}`);
            setCart({ items: [], totalAmount: 0 });
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };

    const proceedToCheckout = () => {
        navigate("/checkout", { state: { cart } });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 rounded-lg p-8">
                    {/* Empty Cart Icon */}
                    <div className="w-32 h-32 mb-6 text-gray-300">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                            <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" />
                            <path d="M9 8V17H11V8H9ZM13 8V17H15V8H13Z" />
                        </svg>
                    </div>

                    {/* Message */}
                    <h2 className="text-3xl font-bold text-gray-700 mb-4">Giỏ hàng của bạn đang trống</h2>
                    <p className="text-gray-500 text-lg mb-8 text-center max-w-md">
                        Hãy khám phá menu của chúng tôi và thêm những món ăn yêu thích vào giỏ hàng!
                    </p>

                    {/* Action Button */}
                    <button
                        onClick={() => navigate("/menu")}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                     text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 
                     transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                        <span>Đến Menu Mua Sắm</span>
                    </button>

                    {/* Additional Actions */}
                    <div className="mt-6 flex space-x-4">
                        <button
                            onClick={() => navigate("/recommendations")}
                            className="text-blue-500 hover:text-blue-600 font-medium underline"
                        >
                            Xem gợi ý món ăn
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                            onClick={() => navigate("/orders")}
                            className="text-blue-500 hover:text-blue-600 font-medium underline"
                        >
                            Xem lịch sử đơn hàng
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>
            <div className="grid grid-cols-1 gap-4">
                {cart.items.map((item) => (
                    <div
                        key={item.foodId}
                        className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center space-x-4">
                            <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                            <div>
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <p className="text-gray-600">{item.price.toLocaleString("vi-VN")}đ</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
                                    className="px-3 py-1 border rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="font-medium px-3">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
                                    className="px-3 py-1 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={() => removeItem(item.foodId)}
                                className="text-red-500 hover:text-red-700 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-semibold">Tổng cộng:</span>
                    <span className="text-2xl font-bold text-blue-600">
                        {cart.totalAmount.toLocaleString("vi-VN")}đ
                    </span>
                </div>
                <div className="flex space-x-4 justify-end">
                    <button
                        onClick={clearCart}
                        className="px-6 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        Xóa tất cả
                    </button>
                    <button
                        onClick={proceedToCheckout}
                        className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                    >
                        Tiếp tục thanh toán
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
