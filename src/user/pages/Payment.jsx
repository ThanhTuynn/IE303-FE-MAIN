import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, MapPin, Clock, CreditCard, Truck, Info } from "lucide-react";
import AddressChangePopup from "../components/AddressChangePopup";
import PaymentButton from "../components/PaymentButton";
import EnhancedPaymentButton from "../components/EnhancedPaymentButton";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import cartService from "../services/cartService";
import { getUserFromLocalStorage, getTokenFromLocalStorage } from "../utils/localStorage";
import { toast } from "../components/Toast";

const Payment = () => {
    const [address, setAddress] = useState("");
    const [deliveryTime, setDeliveryTime] = useState("Giao ngay (15 - 30 phút)");
    const [paymentMethod, setPaymentMethod] = useState("PayOS");
    const [showAddressPopup, setShowAddressPopup] = useState(false);

    const [receiverName, setReceiverName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [newAddress, setNewAddress] = useState("");

    const [showTimePopup, setShowTimePopup] = useState(false);
    const [selectedTime, setSelectedTime] = useState("Giao ngay (15 - 30 phút)");

    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [tempPaymentMethod, setTempPaymentMethod] = useState(paymentMethod);

    // User state
    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    // Cart data from navigation
    const navigate = useNavigate();
    const location = useLocation();
    const cartData = location.state;

    const [showOrderSuccess, setShowOrderSuccess] = useState(false);

    // Generate delivery time slots for today and tomorrow
    const generateTimeSlots = () => {
        const timeSlots = [
            { time: "07:00 - 08:00", label: "Giờ cao điểm" },
            { time: "08:00 - 09:00", label: null },
            { time: "09:00 - 10:00", label: null },
            { time: "10:00 - 11:00", label: null },
            { time: "11:00 - 12:00", label: "Giờ cao điểm" },
            { time: "12:00 - 13:00", label: "Giờ cao điểm" },
            { time: "13:00 - 14:00", label: null },
            { time: "14:00 - 15:00", label: null },
            { time: "15:00 - 16:00", label: null },
            { time: "16:00 - 17:00", label: null },
            { time: "17:00 - 18:00", label: "Giờ cao điểm" },
            { time: "18:00 - 19:00", label: "Giờ cao điểm" },
            { time: "19:00 - 20:00", label: null },
            { time: "20:00 - 21:00", label: null },
        ];

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const formatDate = (date) => {
            const days = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
            const dayName = days[date.getDay()];
            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const year = date.getFullYear();
            return `${dayName}, ${day}/${month}/${year}`;
        };

        const todayFormatted = formatDate(today);
        const tomorrowFormatted = formatDate(tomorrow);

        // Filter available slots for today (only future time slots)
        const currentHour = today.getHours();
        const availableTodaySlots = timeSlots.filter((slot) => {
            const slotHour = parseInt(slot.time.split(":")[0]);
            return slotHour > currentHour; // Only show future time slots for today
        });

        return {
            today: {
                date: todayFormatted,
                slots: availableTodaySlots,
            },
            tomorrow: {
                date: tomorrowFormatted,
                slots: timeSlots, // All slots available for tomorrow
            },
        };
    };

    // Get user info from localStorage and cart data
    useEffect(() => {
        const token = getTokenFromLocalStorage();
        const user = getUserFromLocalStorage();

        if (token && user) {
            setUserId(user.id || user._id);
            setIsLoggedIn(true);
            setUserInfo(user);

            // Set user info for delivery - using actual data from localStorage
            const userName = user.fullName || user.name || user.username || "";
            const userPhone = user.phone || user.phoneNumber || user.tel || "";

            setReceiverName(userName);
            setPhoneNumber(userPhone);
            setNewAddress(""); // Always start with empty address for user to input

            // Set initial address display with real user data
            const phoneDisplay = userPhone
                ? userPhone.startsWith("0")
                    ? `(+84) ${userPhone.substring(1)}`
                    : userPhone.includes("+84")
                    ? userPhone
                    : `(+84) ${userPhone}`
                : "";

            const initialAddress =
                userName || userPhone
                    ? `${userName || "Người nhận"} ${phoneDisplay} - Vui lòng nhập địa chỉ giao hàng chi tiết`
                    : "Vui lòng nhập đầy đủ thông tin giao hàng";

            setAddress(initialAddress);

            // Show welcome toast for returning users
            if (userName) {
                toast.success(`Chào mừng ${userName}! Hãy kiểm tra thông tin giao hàng.`);
            }
        } else {
            setIsLoggedIn(false);
            setUserInfo(null);

            // Clear any existing data
            setReceiverName("");
            setPhoneNumber("");
            setNewAddress("");
            setAddress("Vui lòng đăng nhập để tiếp tục đặt hàng");

            toast.warning("Vui lòng đăng nhập để tiếp tục đặt hàng");
        }

        // Check if cart data exists
        if (!cartData || !cartData.cartItems || cartData.cartItems.length === 0) {
            toast.error("Không có sản phẩm nào được chọn. Chuyển về giỏ hàng...");
            setTimeout(() => navigate("/cart"), 2000);
        }
    }, [cartData, navigate]);

    // Get order data - prioritize cart data, avoid hardcoded fallbacks
    const orderItems = cartData?.cartItems || [];
    const totalAmount = cartData?.totalAmount || 0;

    // Customer info - use real data from localStorage, no hardcoded email
    const customerInfo = userInfo
        ? {
              name: userInfo.fullName || userInfo.name || userInfo.username || receiverName,
              email: userInfo.email || "", // Use actual email from localStorage
              phone: (userInfo.phone || userInfo.phoneNumber || phoneNumber || "").replace(/^\+84\s*/, "0"),
          }
        : {
              name: receiverName,
              email: "", // No hardcoded email
              phone: phoneNumber.replace(/^\+84\s*/, "0"),
          };

    const orderId = `PAY_${Date.now()}`;

    const handleAddressChange = () => {
        // Validate required fields
        if (!receiverName.trim()) {
            toast.error("Vui lòng nhập tên người nhận hàng");
            return;
        }
        if (!phoneNumber.trim()) {
            toast.error("Vui lòng nhập số điện thoại");
            return;
        }
        if (!newAddress.trim()) {
            toast.error("Vui lòng nhập địa chỉ giao hàng");
            return;
        }

        // Format phone number properly
        let formattedPhone = phoneNumber;

        if (phoneNumber) {
            if (phoneNumber.startsWith("0")) {
                formattedPhone = `(+84) ${phoneNumber.substring(1)}`;
            } else if (!phoneNumber.includes("+84")) {
                formattedPhone = `(+84) ${phoneNumber}`;
            }
        }

        const updatedAddress = `${receiverName} ${formattedPhone} - ${newAddress}`;
        setAddress(updatedAddress);
        setShowAddressPopup(false);

        toast.success("Đã cập nhật thông tin giao hàng thành công!");
    };

    const handleTimeChange = () => {
        setDeliveryTime(selectedTime);
        setShowTimePopup(false);
        toast.success(`Đã chọn thời gian giao hàng: ${selectedTime}`);
    };

    const handlePaymentMethodChange = () => {
        setPaymentMethod(tempPaymentMethod);
        setShowPaymentPopup(false);
        toast.success(`Đã chọn phương thức thanh toán: ${tempPaymentMethod}`);
    };

    const deliverySlots = generateTimeSlots();

    // Redirect to login if not logged in
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 font-kanit flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center border-t-4 border-red-500">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Cần đăng nhập</h2>
                    <p className="text-gray-600 mb-6">Vui lòng đăng nhập để tiếp tục đặt hàng</p>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Đăng nhập
                        </button>
                        <button
                            onClick={() => navigate("/cart")}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold transition-all duration-200"
                        >
                            Quay lại giỏ hàng
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Show loading if user info is being loaded
    if (isLoggedIn && !userInfo) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 font-kanit flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 font-kanit">
            {/* Header với gradient đẹp */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Thanh toán</h1>
                            <p className="text-red-100 text-sm">Kiểm tra và hoàn tất đơn hàng của bạn</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left Column - Order Info */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Delivery Address Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5" />
                                    <h3 className="font-semibold text-lg">Thông tin nhận hàng</h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <p
                                            className={`text-sm ${
                                                !newAddress.trim() ? "text-red-500 italic" : "text-gray-700"
                                            } mb-2`}
                                        >
                                            {address || "Vui lòng nhập đầy đủ thông tin giao hàng"}
                                        </p>
                                        {userInfo && (
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Info className="w-4 h-4" />
                                                <span>Email: {userInfo.email || "Chưa có email"}</span>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-blue-200"
                                        onClick={() => setShowAddressPopup(true)}
                                    >
                                        {address && newAddress.trim() ? "Thay đổi" : "Thêm địa chỉ"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Time Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5" />
                                    <h3 className="font-semibold text-lg">Thời gian nhận hàng</h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <Truck className="w-5 h-5 text-green-600" />
                                        </div>
                                        <span className="text-gray-700 font-medium">{deliveryTime}</span>
                                    </div>
                                    <button
                                        className="bg-green-50 hover:bg-green-100 text-green-600 px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-green-200"
                                        onClick={() => setShowTimePopup(true)}
                                    >
                                        Thay đổi
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="w-5 h-5" />
                                    <h3 className="font-semibold text-lg">Phương thức thanh toán</h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                            {paymentMethod === "PayOS" ? "💳" : "💵"}
                                        </div>
                                        <span className="text-gray-700 font-medium">{paymentMethod}</span>
                                    </div>
                                    <button
                                        className="bg-purple-50 hover:bg-purple-100 text-purple-600 px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-purple-200"
                                        onClick={() => {
                                            setTempPaymentMethod(paymentMethod);
                                            setShowPaymentPopup(true);
                                        }}
                                    >
                                        Thay đổi
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-6">
                            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4">
                                <h3 className="font-semibold text-lg">Tóm tắt đơn hàng</h3>
                            </div>
                            <div className="p-6">
                                {/* Order Items with Images */}
                                <div className="space-y-4 mb-6">
                                    {orderItems.map((item, index) => (
                                        <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                                            {/* Food Image */}
                                            <div className="w-16 h-16 flex-shrink-0">
                                                <img
                                                    src={
                                                        item.imageUrl ||
                                                        item.image ||
                                                        "https://via.placeholder.com/64x64?text=Food"
                                                    }
                                                    alt={item.name}
                                                    className="w-full h-full object-cover rounded-lg shadow-sm"
                                                    onError={(e) => {
                                                        e.target.src = "https://via.placeholder.com/64x64?text=Food";
                                                    }}
                                                />
                                            </div>

                                            {/* Item Details */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
                                                    {item.name}
                                                </h4>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-500">
                                                        {item.price.toLocaleString()}đ × {item.quantity}
                                                    </span>
                                                    <span className="font-bold text-red-600 text-sm">
                                                        {(item.price * item.quantity).toLocaleString()}đ
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200 pt-4 mb-6">
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Tạm tính</span>
                                            <span>{totalAmount.toLocaleString()}đ</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Phí giao hàng</span>
                                            <span className="text-green-600 font-medium">Miễn phí</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-lg font-bold text-red-600 pt-2 border-t border-gray-200">
                                        <span>Tổng cần thanh toán</span>
                                        <span>{totalAmount.toLocaleString()}đ</span>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                {orderItems.length > 0 && totalAmount > 0 ? (
                                    <div>
                                        {/* Address validation warning */}
                                        {(!newAddress.trim() || !receiverName.trim() || !phoneNumber.trim()) && (
                                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Info className="w-4 h-4 text-amber-600" />
                                                    <p className="text-amber-800 text-sm font-medium">
                                                        Vui lòng nhập đầy đủ thông tin giao hàng
                                                    </p>
                                                </div>
                                                <div className="text-xs text-amber-700 space-y-1">
                                                    {!receiverName.trim() && <div>• Tên người nhận</div>}
                                                    {!phoneNumber.trim() && <div>• Số điện thoại</div>}
                                                    {!newAddress.trim() && <div>• Địa chỉ giao hàng</div>}
                                                </div>
                                                <button
                                                    onClick={() => setShowAddressPopup(true)}
                                                    className="text-amber-700 underline text-sm mt-2 hover:text-amber-800 font-medium"
                                                >
                                                    Nhập thông tin giao hàng →
                                                </button>
                                            </div>
                                        )}

                                        {paymentMethod === "PayOS" ? (
                                            /* PayOS Payment */
                                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-blue-700 font-semibold">
                                                        💳 Thanh toán qua PayOS
                                                    </span>
                                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                        Nhanh & An toàn
                                                    </span>
                                                </div>

                                                <EnhancedPaymentButton
                                                    userId={userId}
                                                    orderItems={orderItems}
                                                    deliveryAddress={address}
                                                    paymentMethod="PayOS"
                                                    specialInstructions={`Giao hàng: ${deliveryTime}`}
                                                    customerInfo={customerInfo}
                                                    disabled={
                                                        !newAddress.trim() ||
                                                        !receiverName.trim() ||
                                                        !phoneNumber.trim()
                                                    }
                                                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                                                        newAddress.trim() && receiverName.trim() && phoneNumber.trim()
                                                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    }`}
                                                    onError={(error) => {
                                                        toast.error(
                                                            `Đặt hàng thất bại: ${
                                                                error.message || "Lỗi không xác định"
                                                            }`
                                                        );
                                                    }}
                                                    onSuccess={(result) => {
                                                        toast.success(
                                                            "Đặt hàng thành công! Chuyển hướng thanh toán..."
                                                        );
                                                    }}
                                                />
                                                <p className="text-xs text-gray-600 mt-2 text-center">
                                                    Hỗ trợ thanh toán qua ngân hàng, ví điện tử và thẻ ATM
                                                </p>
                                            </div>
                                        ) : (
                                            /* Cash Payment */
                                            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-green-700 font-semibold">
                                                        💵 Thanh toán bằng tiền mặt
                                                    </span>
                                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                        Thanh toán khi nhận hàng
                                                    </span>
                                                </div>

                                                <EnhancedPaymentButton
                                                    userId={userId}
                                                    orderItems={orderItems}
                                                    deliveryAddress={address}
                                                    paymentMethod="Tiền mặt"
                                                    specialInstructions={`Thanh toán khi nhận hàng - Giao hàng: ${deliveryTime}`}
                                                    customerInfo={customerInfo}
                                                    disabled={
                                                        !newAddress.trim() ||
                                                        !receiverName.trim() ||
                                                        !phoneNumber.trim()
                                                    }
                                                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                                                        newAddress.trim() && receiverName.trim() && phoneNumber.trim()
                                                            ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    }`}
                                                    onSuccess={async (result) => {
                                                        toast.success("Đặt hàng thành công! Thanh toán khi nhận hàng.");

                                                        // Clear cart after successful cash order
                                                        try {
                                                            const clearResult = await cartService.clearCart();
                                                            if (clearResult.success) {
                                                                toast.info("Giỏ hàng đã được làm trống.");
                                                            } else {
                                                                toast.warning(
                                                                    "Đặt hàng thành công nhưng chưa xóa giỏ hàng."
                                                                );
                                                            }
                                                        } catch (error) {
                                                            toast.warning(
                                                                "Đặt hàng thành công nhưng có lỗi khi xóa giỏ hàng."
                                                            );
                                                        }

                                                        setTimeout(() => {
                                                            navigate("/payment-success", {
                                                                state: {
                                                                    orderId: result.order.id,
                                                                    orderCode: null,
                                                                    amount: result.order.totalAmount,
                                                                    items: orderItems,
                                                                    customerInfo,
                                                                    orderData: result.order,
                                                                    paymentMethod: "Tiền mặt",
                                                                },
                                                            });
                                                        }, 1500);
                                                    }}
                                                    onError={(error) => {
                                                        toast.error(
                                                            `Đặt hàng thất bại: ${
                                                                error.message || "Lỗi không xác định"
                                                            }`
                                                        );
                                                    }}
                                                />
                                                <p className="text-xs text-gray-600 mt-2 text-center">
                                                    Bạn sẽ thanh toán khi nhận hàng
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <p className="text-gray-500 mb-2">Không có sản phẩm hợp lệ</p>
                                            <button
                                                onClick={() => navigate("/cart")}
                                                className="text-red-600 hover:text-red-700 font-semibold underline"
                                            >
                                                Quay lại giỏ hàng
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Address Change Popup */}
            {showAddressPopup && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
                    <div className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4">
                            <h3 className="text-xl font-bold text-center">Thông tin nhận hàng</h3>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-6">
                            {/* Show current user data from localStorage */}
                            {userInfo && (
                                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Info className="w-4 h-4 text-blue-600" />
                                        <p className="text-sm text-blue-800 font-medium">Thông tin từ tài khoản:</p>
                                    </div>
                                    <p className="text-sm text-blue-700">
                                        Tên: {userInfo.fullName || userInfo.name || "Chưa có"} | SĐT:{" "}
                                        {userInfo.phone || "Chưa có"} | Email: {userInfo.email || "Chưa có"}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-6">
                                <div>
                                    <label className="block mb-2 font-semibold text-gray-700">
                                        Tên người nhận hàng <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={receiverName}
                                        onChange={(e) => setReceiverName(e.target.value)}
                                        placeholder={
                                            userInfo?.fullName || userInfo?.name || "Nhập tên người nhận hàng..."
                                        }
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold text-gray-700">
                                        Số điện thoại <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder={userInfo?.phone || "Nhập số điện thoại (VD: 0901234567)"}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold text-gray-700">
                                        Địa chỉ giao hàng <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={newAddress}
                                        onChange={(e) => setNewAddress(e.target.value)}
                                        placeholder="Nhập địa chỉ chi tiết (VD: Số 123, Đường ABC, Phường XYZ, Quận 1, TP.HCM)"
                                        rows="3"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none transition-all duration-200"
                                    />
                                </div>

                                {/* Validation message */}
                                {(!receiverName.trim() || !phoneNumber.trim() || !newAddress.trim()) && (
                                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <Info className="w-4 h-4 text-amber-600" />
                                            <p className="text-sm text-amber-800 font-medium">
                                                Vui lòng điền đầy đủ thông tin để có thể giao hàng chính xác
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => setShowAddressPopup(false)}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl transition-all duration-200 font-semibold"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleAddressChange}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                                    >
                                        Lưu thông tin
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showTimePopup && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4">
                            <h3 className="text-xl font-bold text-center">Chọn thời gian nhận hàng</h3>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-6">
                            <p className="font-semibold text-gray-700 mb-6 text-center">
                                Chọn thời gian nhận hàng mong muốn
                            </p>

                            {/* Giao ngay */}
                            <div
                                onClick={() => setSelectedTime("Giao ngay (15 - 30 phút)")}
                                className={`flex justify-between items-center border rounded-xl px-6 py-4 cursor-pointer mb-6 transition-all duration-200 ${
                                    selectedTime === "Giao ngay (15 - 30 phút)"
                                        ? "border-green-500 bg-green-50 text-green-700 shadow-lg transform scale-[1.02]"
                                        : "border-gray-200 hover:border-green-300 hover:bg-green-50 hover:shadow-md"
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="text-2xl">🚀</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg">Giao ngay</div>
                                        <div className="text-sm text-gray-600">
                                            Đơn hàng sẽ được giao trong 15-30 phút
                                        </div>
                                    </div>
                                </div>
                                <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full font-medium">
                                    15 - 30 phút
                                </span>
                            </div>

                            {/* Today's slots */}
                            {deliverySlots.today.slots.length > 0 && (
                                <div className="mb-8">
                                    <h4 className="font-bold text-xl mb-4 flex items-center gap-3 text-gray-800">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-lg">📅</span>
                                        </div>
                                        {deliverySlots.today.date} (Hôm nay)
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {deliverySlots.today.slots.map((slot, index) => (
                                            <div
                                                key={`today-${index}`}
                                                onClick={() =>
                                                    setSelectedTime(`${deliverySlots.today.date} ${slot.time}`)
                                                }
                                                className={`border rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 ${
                                                    selectedTime === `${deliverySlots.today.date} ${slot.time}`
                                                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-lg transform scale-[1.02]"
                                                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold">{slot.time}</span>
                                                    {slot.label && (
                                                        <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                                                            {slot.label}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {deliverySlots.today.slots.length === 0 && (
                                        <p className="text-gray-500 text-sm italic text-center py-4">
                                            Không còn khung giờ nào khả dụng cho hôm nay
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Tomorrow's slots */}
                            <div className="mb-8">
                                <h4 className="font-bold text-xl mb-4 flex items-center gap-3 text-gray-800">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                        <span className="text-lg">🗓️</span>
                                    </div>
                                    {deliverySlots.tomorrow.date} (Ngày mai)
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {deliverySlots.tomorrow.slots.map((slot, index) => (
                                        <div
                                            key={`tomorrow-${index}`}
                                            onClick={() =>
                                                setSelectedTime(`${deliverySlots.tomorrow.date} ${slot.time}`)
                                            }
                                            className={`border rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 ${
                                                selectedTime === `${deliverySlots.tomorrow.date} ${slot.time}`
                                                    ? "border-purple-500 bg-purple-50 text-purple-700 shadow-lg transform scale-[1.02]"
                                                    : "border-gray-200 hover:border-purple-300 hover:bg-purple-50 hover:shadow-md"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold">{slot.time}</span>
                                                {slot.label && (
                                                    <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                                                        {slot.label}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Lưu ý */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
                                <h5 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                                    <Info className="w-5 h-5" />
                                    Lưu ý quan trọng:
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
                                    <div className="flex items-start gap-2">
                                        <span className="text-orange-500 font-bold">⚠️</span>
                                        <div>
                                            <strong>Giờ cao điểm:</strong> Có thể giao chậm hơn dự kiến do lượng đơn
                                            hàng lớn
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-500 font-bold">🚀</span>
                                        <div>
                                            <strong>Giao ngay:</strong> Ưu tiên cho các đơn hàng cần gấp
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-blue-500 font-bold">📋</span>
                                        <div>
                                            <strong>Đặt trước:</strong> Đảm bảo món ăn được chuẩn bị tốt nhất
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Nút điều khiển */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowTimePopup(false)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl transition-all duration-200 font-semibold"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleTimeChange}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                                >
                                    Lưu thời gian
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Method Change Popup */}
            {showPaymentPopup && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-4">
                            <h3 className="text-xl font-bold text-center">Chọn phương thức thanh toán</h3>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-6">
                            <p className="font-semibold text-gray-700 mb-6 text-center">
                                Chọn phương thức thanh toán phù hợp
                            </p>

                            <div className="space-y-4">
                                {[
                                    {
                                        label: "PayOS - Thanh toán trực tuyến",
                                        value: "PayOS",
                                        icon: "https://res.cloudinary.com/dai92e7cq/image/upload/v1748287590/payos-logo_hxqwdi.png",
                                        description: "Thanh toán ngay qua ngân hàng, ví điện tử",
                                        benefits: ["Nhanh chóng", "An toàn", "Hỗ trợ 24/7"],
                                        bgColor: "bg-blue-50",
                                        borderColor: "border-blue-500",
                                        textColor: "text-blue-700",
                                    },
                                    {
                                        label: "Tiền mặt",
                                        value: "Tiền mặt",
                                        icon: "https://res.cloudinary.com/dbr85jktp/image/upload/v1748287327/CASH_ypopzk.png",
                                        description: "Thanh toán khi nhận hàng",
                                        benefits: ["Thuận tiện", "Truyền thống", "Không cần thẻ"],
                                        bgColor: "bg-green-50",
                                        borderColor: "border-green-500",
                                        textColor: "text-green-700",
                                    },
                                ].map((option) => (
                                    <div
                                        key={option.value}
                                        onClick={() => setTempPaymentMethod(option.value)}
                                        className={`flex items-center gap-4 border-2 px-6 py-4 rounded-xl cursor-pointer transition-all duration-200 ${
                                            tempPaymentMethod === option.value
                                                ? `${option.borderColor} ${option.bgColor} shadow-lg transform scale-[1.02]`
                                                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                                        }`}
                                    >
                                        {/* Icon */}
                                        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white border border-gray-200 overflow-hidden shadow-sm">
                                            <img
                                                src={option.icon}
                                                alt={option.label}
                                                className="w-10 h-10 object-contain"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <h4
                                                className={`text-lg font-bold ${
                                                    tempPaymentMethod === option.value
                                                        ? option.textColor
                                                        : "text-gray-800"
                                                }`}
                                            >
                                                {option.label}
                                            </h4>
                                            <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                                            <div className="flex gap-2">
                                                {option.benefits.map((benefit, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                                                    >
                                                        {benefit}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Selected indicator */}
                                        {tempPaymentMethod === option.value && (
                                            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                                                <CheckCircle className="w-5 h-5 text-white" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={() => setShowPaymentPopup(false)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl transition-all duration-200 font-semibold"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handlePaymentMethodChange}
                                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                                >
                                    Lưu lựa chọn
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payment;
