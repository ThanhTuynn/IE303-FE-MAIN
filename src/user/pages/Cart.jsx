import React, { useState, useEffect } from "react";
import { Trash, CheckSquare, Square, ShoppingCart, Plus, Minus, Tag, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PaymentButton from "../components/PaymentButton";
import EnhancedPaymentButton from "../components/EnhancedPaymentButton";
import useNotification from "../hooks/useNotification";

const Cart = () => {
    const [items, setItems] = useState([]);
    const [discountCode, setDiscountCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
    const navigate = useNavigate();
    const notify = useNotification();

    // Customer info from localStorage
    const customerInfo = (() => {
        try {
            const userData = localStorage.getItem("userData");
            if (userData) {
                const user = JSON.parse(userData);
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
        const token = localStorage.getItem("jwtToken");
        const userData = localStorage.getItem("userData");

        if (token && userData) {
            try {
                const user = JSON.parse(userData);
                setUserId(user.id || user._id);
                setIsLoggedIn(true);
                console.log("Cart - User logged in:", user);
            } catch (error) {
                console.error("Error parsing user data:", error);
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
            console.warn("Cart - No user data found, user may need to login");
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchCart();
        } else if (!isLoggedIn) {
            setLoading(false);
        }
    }, [userId, isLoggedIn]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            if (userId) {
                const response = await axios.get(`http://localhost:8080/api/carts/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                    },
                });
                console.log("Cart data received:", response.data);
                console.log("Cart items:", response.data.items);

                // Debug first item structure if exists
                if (response.data.items && response.data.items.length > 0) {
                    console.log("First cart item structure:", response.data.items[0]);
                    console.log(
                        "Image fields - imageUrl:",
                        response.data.items[0].imageUrl,
                        "image:",
                        response.data.items[0].image
                    );
                }

                setItems(response.data.items || []);
            }
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
            console.error("Error fetching cart:", err);
            notify.error("Không thể tải giỏ hàng. Vui lòng thử lại.");
        }
    };

    const handleQuantityChange = async (id, delta) => {
        const token = localStorage.getItem("jwtToken");
        // Optimistically update the state
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.foodId === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
            )
        );

        const newQuantity = items.find((item) => item.foodId === id).quantity + delta; // Calculate new quantity
        const finalQuantity = Math.max(1, newQuantity); // Ensure quantity is at least 1

        if (!userId || !token) {
            notify.error("Vui lòng đăng nhập để cập nhật giỏ hàng.");
            return;
        }

        try {
            // Call backend API to update the quantity
            await axios.put(`http://localhost:8080/api/carts/${userId}/items/${id}?quantity=${finalQuantity}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(`Quantity updated for foodId ${id} to ${finalQuantity}`);
            // Trigger cart update event
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (err) {
            console.error("Error updating quantity on backend:", err);
            notify.error("Không thể cập nhật số lượng. Vui lòng thử lại.");
            // Revert the optimistic update on error
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.foodId === id
                        ? { ...item, quantity: item.quantity - delta } // Revert to previous quantity
                        : item
                )
            );
        }
    };

    const handleCheckboxChange = (id) => {
        setItems((prevItems) =>
            prevItems.map((item) => (item.foodId === id ? { ...item, checked: !item.checked } : item))
        );
    };

    const handleRemoveItem = async (id) => {
        const token = localStorage.getItem("jwtToken");

        try {
            await axios.delete(`http://localhost:8080/api/carts/${userId}/items/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setItems((prevItems) => prevItems.filter((item) => item.foodId !== id));
            notify.success("Đã xóa món ăn khỏi giỏ hàng!");
            // Trigger cart update event
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (error) {
            console.error("Error removing item:", error);
            notify.error("Không thể xóa món ăn. Vui lòng thử lại.");
        }
    };

    const handleDiscountApply = async () => {
        if (!discountCode.trim()) {
            notify.warning("Vui lòng nhập mã giảm giá.");
            return;
        }

        setIsApplyingDiscount(true);

        // Simulate discount validation
        setTimeout(() => {
            if (discountCode.toUpperCase() === "DISCOUNT20") {
                setDiscount(20000);
                notify.success("Áp dụng mã giảm giá thành công!");
            } else if (discountCode.toUpperCase() === "SAVE10") {
                setDiscount(10000);
                notify.success("Áp dụng mã giảm giá thành công!");
            } else {
                setDiscount(0);
                notify.error("Mã giảm giá không hợp lệ.");
            }
            setIsApplyingDiscount(false);
        }, 1000);
    };

    const handleSelectAll = () => {
        const allSelected = items.every((item) => item.checked);
        setItems((prevItems) => prevItems.map((item) => ({ ...item, checked: !allSelected })));
    };

    const totalPrice = items.reduce((total, item) => (item.checked ? total + item.price * item.quantity : total), 0);
    const finalAmount = Math.max(0, totalPrice - discount);
    const selectedItems = items.filter((item) => item.checked);
    const selectedCount = selectedItems.length;

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center font-kanit">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải giỏ hàng...</p>
                </div>
            </div>
        );
    }

    // Not logged in state
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center font-kanit">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
                    <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Bạn chưa đăng nhập</h2>
                    <p className="text-gray-600 mb-6">Vui lòng đăng nhập để xem giỏ hàng của bạn</p>
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                        Đăng nhập
                    </button>
                </div>
            </div>
        );
    }

    // Empty cart state
    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center font-kanit">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
                    <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h2>
                    <p className="text-gray-600 mb-6">Hãy khám phá thực đơn và thêm món ngon vào giỏ hàng!</p>
                    <button
                        onClick={() => navigate("/menu")}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                        Xem thực đơn
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-kanit">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Giỏ hàng của bạn</h1>
                    <p className="text-gray-600">Quản lý các món ăn bạn đã chọn</p>
                </div>

                <div className="lg:flex lg:gap-8">
                    {/* Cart Items - Left Side */}
                    <div className="lg:w-2/3 mb-8 lg:mb-0">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            {/* Select All Header */}
                            <div className="bg-gray-50 p-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <button
                                            onClick={handleSelectAll}
                                            className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
                                        >
                                            {items.every((item) => item.checked) ? (
                                                <CheckSquare className="w-5 h-5 mr-2" />
                                            ) : (
                                                <Square className="w-5 h-5 mr-2" />
                                            )}
                                            <span className="font-medium">Chọn tất cả ({items.length} món)</span>
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate("/order-history")}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Lịch sử đơn hàng
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Cart Items */}
                            <div className="divide-y divide-gray-200">
                                {items.map((item) => (
                                    <div key={item.foodId} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            {/* Checkbox */}
                                            <button
                                                onClick={() => handleCheckboxChange(item.foodId)}
                                                className="text-gray-400 hover:text-red-600 transition-colors"
                                            >
                                                {item.checked ? (
                                                    <CheckSquare className="w-6 h-6" />
                                                ) : (
                                                    <Square className="w-6 h-6" />
                                                )}
                                            </button>

                                            {/* Product Image */}
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.imageUrl || item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        console.error(
                                                            "Failed to load image for item:",
                                                            item.name,
                                                            "URL:",
                                                            item.imageUrl || item.image
                                                        );
                                                        e.target.src =
                                                            "https://via.placeholder.com/80x80?text=No+Image";
                                                    }}
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate">
                                                    {item.name}
                                                </h3>
                                                <p className="text-red-600 font-bold text-xl">
                                                    {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                                                </p>
                                                <p className="text-gray-500 text-sm">
                                                    {item.price.toLocaleString("vi-VN")}đ/món
                                                </p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleQuantityChange(item.foodId, -1)}
                                                    disabled={item.quantity <= 1}
                                                    className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-red-600 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-12 text-center font-semibold text-lg">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.foodId, 1)}
                                                    className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-red-600 hover:text-red-600 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => handleRemoveItem(item.foodId)}
                                                className="text-gray-400 hover:text-red-600 transition-colors p-2"
                                            >
                                                <Trash className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary - Right Side */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
                            {/* Header */}
                            <div className="bg-red-600 text-white p-6">
                                <h2 className="text-xl font-bold mb-2">Tóm tắt đơn hàng</h2>
                                <p className="text-red-100 text-sm">{selectedCount} món được chọn</p>
                            </div>

                            <div className="p-6">
                                {/* Discount Code */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Tag className="w-4 h-4 inline mr-1" />
                                        Mã giảm giá
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Nhập mã giảm giá"
                                            value={discountCode}
                                            onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                        <button
                                            onClick={handleDiscountApply}
                                            disabled={isApplyingDiscount || !discountCode.trim()}
                                            className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isApplyingDiscount ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                "Áp dụng"
                                            )}
                                        </button>
                                    </div>
                                    {discount > 0 && (
                                        <p className="text-green-600 text-sm mt-2 font-medium">
                                            ✓ Mã giảm giá đã được áp dụng
                                        </p>
                                    )}
                                </div>

                                {/* Price Summary */}
                                <div className="space-y-4 border-t border-gray-200 pt-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tạm tính ({selectedCount} món)</span>
                                        <span>{totalPrice.toLocaleString("vi-VN")}đ</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Giảm giá</span>
                                            <span>-{discount.toLocaleString("vi-VN")}đ</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-lg font-bold text-gray-800 border-t border-gray-200 pt-4">
                                        <span>Tổng thanh toán</span>
                                        <span className="text-red-600">{finalAmount.toLocaleString("vi-VN")}đ</span>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <div className="mt-6">
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
                                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                        >
                                            <span>Tiếp tục thanh toán</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    ) : (
                                        <div className="text-center">
                                            <p className="text-gray-500 py-4">
                                                {selectedItems.length === 0
                                                    ? "Vui lòng chọn sản phẩm để tiếp tục"
                                                    : "Không có sản phẩm hợp lệ"}
                                            </p>
                                            <button
                                                onClick={() => navigate("/menu")}
                                                className="text-red-600 hover:text-red-700 font-medium"
                                            >
                                                Quay lại thực đơn
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Security Note */}
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-600 text-center">
                                        🔒 Thông tin thanh toán của bạn được bảo mật
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
