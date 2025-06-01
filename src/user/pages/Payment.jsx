import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react"; // Icons from Lucide
import AddressChangePopup from "../components/AddressChangePopup";
import PaymentButton from "../components/PaymentButton";
import EnhancedPaymentButton from "../components/EnhancedPaymentButton";
import { useNavigate, useLocation } from "react-router-dom";

const Payment = () => {
    const [address, setAddress] = useState("Phương Uyên (+84) 82868383 Tầng 1, Tòa B, UIT");
    const [deliveryTime, setDeliveryTime] = useState("Giao ngay (15 - 30 phút)");
    const [paymentMethod, setPaymentMethod] = useState("PayOS");
    const [showAddressPopup, setShowAddressPopup] = useState(false);

    const [receiverName, setReceiverName] = useState("Phương Uyên");
    const [phoneNumber, setPhoneNumber] = useState("082868383");
    const [newAddress, setNewAddress] = useState("Tầng 1, Tòa B, UIT");

    const [showTimePopup, setShowTimePopup] = useState(false);
    const [selectedTime, setSelectedTime] = useState("Giao ngay (15 - 30 phút)");

    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [tempPaymentMethod, setTempPaymentMethod] = useState(paymentMethod);

    // User state
    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Cart data from navigation
    const navigate = useNavigate();
    const location = useLocation();
    const cartData = location.state;

    const [showOrderSuccess, setShowOrderSuccess] = useState(false);

    // Get user info from localStorage and cart data
    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        const userData = localStorage.getItem("userData");

        if (token && userData) {
            try {
                const user = JSON.parse(userData);
                setUserId(user.id || user._id);
                setIsLoggedIn(true);
                console.log("User logged in:", user);
            } catch (error) {
                console.error("Error parsing user data:", error);
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
            console.warn("No user data found, user may need to login");
        }

        // Check if cart data exists
        if (!cartData || !cartData.cartItems || cartData.cartItems.length === 0) {
            alert("Không có sản phẩm nào được chọn. Vui lòng quay lại giỏ hàng.");
            navigate("/cart");
        }
    }, [cartData, navigate]);

    // Use cart data or fallback to sample data
    const orderItems = cartData?.cartItems || [
        { name: "Bánh mì thịt", quantity: 1, price: 20000 },
        { name: "Bánh mì trứng", quantity: 1, price: 20000 },
        { name: "Nước uống", quantity: 1, price: 10000 },
    ];

    const totalAmount = cartData?.totalAmount || 50000;
    const customerInfo = cartData?.customerInfo || {
        name: receiverName,
        email: "customer@unifoodie.com",
        phone: phoneNumber.replace("(+84) ", "0"),
    };

    const orderId = `PAY_${Date.now()}`;

    const handleAddressChange = () => {
        const updatedAddress = `${receiverName} (+84) ${phoneNumber} ${newAddress}`;
        setAddress(updatedAddress);
        setShowAddressPopup(false);
    };

    return (
        <div className="min-h-screen bg-[#f9f9f9] font-kanit flex flex-col zoom-80">
            {/* Main Content */}
            <div className="flex flex-col p-8 bg-white">
                <h2 className="text-4xl font-bold text-black mb-6">THANH TOÁN</h2>

                {/* Address Section */}
                <div className="flex justify-between items-center mb-6 border p-4 border-gray-300 rounded-lg">
                    <div>
                        <h3 className="text-lg font-semibold">Thông tin nhận hàng</h3>
                        <p>{address}</p>
                    </div>
                    <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => setShowAddressPopup(true)} // Show address popup
                    >
                        Thay đổi
                    </button>
                </div>

                {/* Delivery Time Section */}
                <div className="flex justify-between items-center mb-6 border p-4 border-gray-300 rounded-lg">
                    <div>
                        <h3 className="text-lg font-semibold">Thời gian nhận hàng</h3>
                        <p>{deliveryTime}</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800" onClick={() => setShowTimePopup(true)}>
                        Thay đổi
                    </button>
                </div>

                {/* Payment Method Section */}
                <div className="flex justify-between items-center mb-6 border p-4 border-gray-300 rounded-lg">
                    <div>
                        <h3 className="text-lg font-semibold">Phương thức thanh toán</h3>
                        <p>{paymentMethod}</p>
                    </div>
                    <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => {
                            setTempPaymentMethod(paymentMethod); // giữ giá trị hiện tại
                            setShowPaymentPopup(true);
                        }}
                    >
                        Thay đổi
                    </button>
                </div>

                {/* Order Summary */}
                <div className="border bg-[#fcf3f3] p-6 rounded-lg shadow-lg">
                    <div className="border-b mb-4 pb-4">
                        <div className="flex justify-between text-lg font-semibold mb-4">
                            <span>Tổng cần thanh toán</span>
                            <span>{totalAmount.toLocaleString()}đ</span>
                        </div>
                    </div>

                    {/* Payment Buttons based on selected method */}
                    <div className="flex flex-col gap-3 mt-6">
                        {paymentMethod === "PayOS" ? (
                            /* PayOS Payment */
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-blue-600 font-semibold">💳 Thanh toán qua PayOS</span>
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        Nhanh & An toàn
                                    </span>
                                </div>

                                {/* Login warning */}
                                {!isLoggedIn && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
                                        <p className="text-yellow-800 text-sm">
                                            ⚠️ Vui lòng đăng nhập để có thể đặt hàng và theo dõi đơn hàng
                                        </p>
                                        <button
                                            onClick={() => navigate("/login")}
                                            className="text-blue-600 underline text-sm mt-1"
                                        >
                                            Đăng nhập ngay
                                        </button>
                                    </div>
                                )}

                                <EnhancedPaymentButton
                                    userId={userId || "1"} // Fallback for demo
                                    orderItems={orderItems}
                                    deliveryAddress={address}
                                    paymentMethod="PayOS"
                                    specialInstructions=""
                                    customerInfo={customerInfo}
                                    disabled={!isLoggedIn}
                                    className={`w-full py-3 rounded-lg font-medium ${
                                        isLoggedIn
                                            ? "bg-red-600 hover:bg-red-700 text-white"
                                            : "bg-gray-400 text-gray-200 cursor-not-allowed"
                                    }`}
                                    // ✅ NO onSuccess for PayOS payments
                                    // User will be redirected to PayOS, then return via backend URL
                                    // Success page will be shown after payment completion at return URL
                                    onError={(error) => {
                                        console.error("❌ Enhanced payment error:", error);
                                        alert("Đặt hàng thất bại: " + error.message);
                                    }}
                                />
                                <p className="text-xs text-gray-600 mt-1">
                                    Hỗ trợ thanh toán qua ngân hàng, ví điện tử và thẻ ATM
                                </p>
                            </div>
                        ) : (
                            /* Cash Payment */
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-green-600 font-semibold">💵 Thanh toán bằng tiền mặt</span>
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                        Thanh toán khi nhận hàng
                                    </span>
                                </div>

                                {/* Login warning for cash payment too */}
                                {!isLoggedIn && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
                                        <p className="text-yellow-800 text-sm">
                                            ⚠️ Vui lòng đăng nhập để có thể đặt hàng và theo dõi đơn hàng
                                        </p>
                                        <button
                                            onClick={() => navigate("/login")}
                                            className="text-blue-600 underline text-sm mt-1"
                                        >
                                            Đăng nhập ngay
                                        </button>
                                    </div>
                                )}

                                <EnhancedPaymentButton
                                    userId={userId || "1"} // Fallback for demo
                                    orderItems={orderItems}
                                    deliveryAddress={address}
                                    paymentMethod="Tiền mặt"
                                    specialInstructions="Thanh toán khi nhận hàng"
                                    customerInfo={customerInfo}
                                    disabled={!isLoggedIn}
                                    className={`w-full py-3 rounded-lg font-medium ${
                                        isLoggedIn
                                            ? "bg-green-600 hover:bg-green-700 text-white"
                                            : "bg-gray-400 text-gray-200 cursor-not-allowed"
                                    }`}
                                    onSuccess={(result) => {
                                        console.log("✅ Cash order success:", result);
                                        navigate("/payment-success", {
                                            state: {
                                                orderId: result.order.id,
                                                orderCode: null, // No payment code for cash
                                                amount: result.order.totalAmount,
                                                items: orderItems,
                                                customerInfo,
                                                orderData: result.order,
                                                paymentMethod: "Tiền mặt",
                                            },
                                        });
                                    }}
                                    onError={(error) => {
                                        console.error("❌ Cash order error:", error);
                                        alert("Đặt hàng thất bại: " + error.message);
                                    }}
                                />
                                <p className="text-xs text-gray-600 mt-1">Bạn sẽ thanh toán khi nhận hàng</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Address Change Popup */}
            {showAddressPopup && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
                    <div className="w-[90%] max-w-[600px] bg-white rounded-lg overflow-hidden shadow-lg">
                        {/* Header */}
                        <div className="bg-[#d62828] text-white text-center py-4 text-xl font-bold">
                            Thông tin nhận hàng
                        </div>

                        {/* Body */}
                        <div className="px-6 py-4">
                            <div className="mb-4">
                                <label className="block mb-1 font-medium">Tên người nhận hàng:</label>
                                <input
                                    type="text"
                                    value={receiverName}
                                    onChange={(e) => setReceiverName(e.target.value)}
                                    placeholder="Nhập tên người nhận hàng..."
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 font-medium">Số điện thoại:</label>
                                <input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="Nhập số điện thoại người nhận hàng..."
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block mb-1 font-medium">Địa chỉ nhận hàng:</label>
                                <input
                                    type="text"
                                    value={newAddress}
                                    onChange={(e) => setNewAddress(e.target.value)}
                                    placeholder="Nhập địa chỉ..."
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-between">
                                <button
                                    onClick={() => setShowAddressPopup(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded-md"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleAddressChange}
                                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showTimePopup && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg w-[95%] max-w-[600px] shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className="bg-[#d62828] text-white text-center py-4 text-xl font-bold">
                            Thời gian nhận hàng
                        </div>

                        {/* Content */}
                        <div className="px-6 py-4">
                            <p className="font-medium mb-4">Chọn thời gian nhận hàng mong muốn</p>

                            {/* Giao ngay */}
                            <div
                                onClick={() => setSelectedTime("Giao ngay (15 - 30 phút)")}
                                className={`flex justify-between items-center border rounded-md px-4 py-3 cursor-pointer mb-4 ${
                                    selectedTime === "Giao ngay (15 - 30 phút)"
                                        ? "border-red-600 text-red-600 font-semibold"
                                        : "border-gray-300"
                                }`}
                            >
                                <span>Giao ngay</span>
                                <span>15 - 30 phút</span>
                            </div>

                            {/* Các khung giờ lựa chọn */}
                            {[
                                { time: "07:00 - 08:00", label: "Giờ cao điểm" },
                                { time: "08:00 - 09:00", label: null },
                                { time: "09:00 - 10:00", label: null },
                                { time: "11:00 - 12:00", label: "Giờ cao điểm" },
                            ].map((slot, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedTime(`Thứ 3, 27/5/2025 ${slot.time}`)}
                                    className={`border rounded-md px-4 py-3 cursor-pointer mb-2 ${
                                        selectedTime === `Thứ 3, 27/5/2025 ${slot.time}`
                                            ? "border-red-600 text-red-600 font-semibold"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>Thứ 3, 27/5/2025</span>
                                        {slot.label && (
                                            <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded-full">
                                                {slot.label}
                                            </span>
                                        )}
                                        <span>{slot.time}</span>
                                    </div>
                                </div>
                            ))}

                            {/* Lưu ý */}
                            <p className="text-sm text-red-600 italic mt-3">
                                *Lưu ý: Đặt trước giờ cao điểm để tránh bị chậm giao
                            </p>

                            {/* Nút điều khiển */}
                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={() => setShowTimePopup(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded-md"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={() => {
                                        setDeliveryTime(selectedTime);
                                        setShowTimePopup(false);
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Method Change Popup */}
            {showPaymentPopup && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
                    <div className="bg-white w-[95%] max-w-[600px] rounded-lg overflow-hidden shadow-lg">
                        {/* Header */}
                        <div className="bg-[#d62828] text-white text-center py-4 text-xl font-bold">
                            Phương thức thanh toán
                        </div>

                        {/* Content */}
                        <div className="px-6 py-4">
                            <p className="font-medium mb-4">Chọn phương thức thanh toán</p>

                            {[
                                {
                                    label: "PayOS - Thanh toán trực tuyến",
                                    value: "PayOS",
                                    icon: "https://res.cloudinary.com/dai92e7cq/image/upload/v1748287590/payos-logo_hxqwdi.png",
                                    description: "Thanh toán ngay qua ngân hàng, ví điện tử",
                                },
                                {
                                    label: "Tiền mặt",
                                    value: "Tiền mặt",
                                    icon: "https://res.cloudinary.com/dbr85jktp/image/upload/v1748287327/CASH_ypopzk.png",
                                    description: "Thanh toán khi nhận hàng",
                                },
                            ].map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => setTempPaymentMethod(option.value)}
                                    className={`flex items-center gap-3 border px-4 py-4 mb-3 rounded-md cursor-pointer transition-colors ${
                                        tempPaymentMethod === option.value
                                            ? "border-red-600 bg-red-50 text-red-600 font-semibold"
                                            : "border-gray-300 hover:border-gray-400"
                                    }`}
                                >
                                    {/* Icon */}
                                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 border border-gray-300 overflow-hidden">
                                        <img src={option.icon} alt={option.label} className="w-8 h-8 object-contain" />
                                    </div>

                                    {/* Label and description */}
                                    <div className="flex-1">
                                        <p className="text-base font-medium">{option.label}</p>
                                        <p className="text-sm text-gray-600">{option.description}</p>
                                    </div>

                                    {/* Selected indicator */}
                                    {tempPaymentMethod === option.value && (
                                        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                                            <div className="w-3 h-3 bg-white rounded-full"></div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Action buttons */}
                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={() => setShowPaymentPopup(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded-md"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={() => {
                                        setPaymentMethod(tempPaymentMethod);
                                        setShowPaymentPopup(false);
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showOrderSuccess && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-sm w-full">
                        <h2 className="text-2xl font-bold text-green-600 mb-4">Đơn hàng đã hoàn tất</h2>
                        <p className="text-gray-700">Bạn sẽ được chuyển về giỏ hàng trong giây lát...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payment;
