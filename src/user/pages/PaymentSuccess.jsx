import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, ArrowLeft, Receipt, ShoppingBag, User } from "lucide-react";
import axios from "axios";
import cartService from "../services/cartService";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cartCleared, setCartCleared] = useState(false);

    const orderCode = searchParams.get("orderCode");
    const stateData = location.state;

    // Function to clear cart after successful payment
    const clearCart = async () => {
        const result = await cartService.clearCart();

        if (result.success) {
            setCartCleared(true);
            // Clear backup since payment was successful
            cartService.clearBackup();
            console.log(`🎉 Cart cleared successfully! Removed ${result.clearedCount} items`);
        } else {
            console.error("❌ Failed to clear cart:", result.message);
        }
    };

    useEffect(() => {
        const fetchPaymentInfo = async () => {
            console.log("🏁 PaymentSuccess - useEffect started");
            console.log("📋 Parameters:", { orderCode, stateData: !!stateData, cartCleared });

            let paymentSuccessful = false;

            if (orderCode) {
                try {
                    console.log("🔍 Checking payment status for orderCode:", orderCode);
                    const response = await fetch(`http://localhost:8080/api/payments/status/${orderCode}`);
                    if (response.ok) {
                        const result = await response.json();
                        console.log("📊 Backend payment status response:", result);
                        setPaymentInfo(result.data);

                        // Check if payment is actually successful
                        if (result.data && (result.data.status === "SUCCESS" || result.data.status === "PAID")) {
                            console.log("✅ Payment confirmed successful from backend");
                            paymentSuccessful = true;
                        } else {
                            console.log("❌ Payment not successful, status:", result.data?.status);
                            // Redirect to cancelled page for failed payments
                            if (result.data?.status === "FAILED" || result.data?.status === "CANCELLED") {
                                console.log("🔄 Redirecting to payment cancelled page - CART WILL NOT BE CLEARED");
                                navigate(`/payment-result?orderCode=${orderCode}&status=${result.data.status}`);
                                return;
                            }
                        }
                    } else {
                        console.log("❌ Failed to fetch payment status, response not ok:", response.status);
                    }
                } catch (error) {
                    console.error("❌ Error fetching payment info:", error);
                }
            }

            // If we have state data from navigation (e.g., cash payment), use it
            if (stateData) {
                console.log("📦 Using state data from navigation:", stateData);
                setPaymentInfo({
                    orderCode: stateData.orderCode,
                    orderId: stateData.orderId || `ORDER_${stateData.orderCode}`,
                    amount: stateData.amount,
                    status: "SUCCESS",
                    items: stateData.items,
                    customerInfo: stateData.customerInfo,
                });

                // Cash payments or direct navigation to success page means payment was successful
                paymentSuccessful = true;
                console.log("💵 Cash payment or direct navigation - marking as successful");
            }

            // If no orderCode and no stateData, user probably navigated here incorrectly
            if (!orderCode && !stateData) {
                console.log("⚠️ No payment data found, redirecting to cart");
                alert("Không tìm thấy thông tin thanh toán. Vui lòng thử lại.");
                navigate("/cart");
                return;
            }

            setLoading(false);
            console.log("📈 Final payment status check:", { paymentSuccessful, cartCleared });

            // 🚨 CRITICAL: Only clear cart if payment was actually successful
            // AND we are not going to redirect to another page
            if (paymentSuccessful && !cartCleared) {
                console.log("🎉 Payment confirmed successful - WILL CLEAR CART");
                // Add a small delay to ensure this page is stable before clearing cart
                setTimeout(() => {
                    clearCart();
                }, 1000);
            } else if (!paymentSuccessful) {
                console.log("⚠️ Payment not successful - KEEPING CART ITEMS");
            } else if (cartCleared) {
                console.log("ℹ️ Cart already cleared, skipping");
            }
        };

        fetchPaymentInfo();
    }, [orderCode, stateData, cartCleared, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h1>
                        <p className="text-gray-600">Cảm ơn bạn đã sử dụng dịch vụ của UniFoodie</p>

                        {/* Cart cleared notification */}
                        {cartCleared && (
                            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                                <p className="text-sm text-green-800">
                                    ✅ Giỏ hàng đã được làm trống sau khi thanh toán thành công
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Payment Info */}
                    {paymentInfo && (
                        <div className="space-y-6">
                            {/* Order Summary */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Receipt className="w-5 h-5 text-gray-500" />
                                    <span className="font-semibold text-gray-700">Thông tin đơn hàng</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-gray-600">Mã đơn hàng:</span>
                                            <p className="font-medium">
                                                {paymentInfo.orderId || `ORDER_${paymentInfo.orderCode}`}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Mã thanh toán:</span>
                                            <p className="font-medium">{paymentInfo.orderCode}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-gray-600">Số tiền:</span>
                                            <p className="font-bold text-red-600 text-lg">
                                                {paymentInfo.amount?.toLocaleString("vi-VN")} VNĐ
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Trạng thái:</span>
                                            <p className="font-medium text-green-600">✓ Thành công</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            {paymentInfo.items && paymentInfo.items.length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <ShoppingBag className="w-5 h-5 text-gray-500" />
                                        <span className="font-semibold text-gray-700">Chi tiết đơn hàng</span>
                                    </div>

                                    <div className="space-y-3">
                                        {paymentInfo.items.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {item.image && (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-10 h-10 object-cover rounded"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-900">{item.name}</p>
                                                        <p className="text-sm text-gray-600">
                                                            Số lượng: {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-red-600">
                                                        {((item.price || 0) * (item.quantity || 1)).toLocaleString(
                                                            "vi-VN"
                                                        )}{" "}
                                                        VNĐ
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Customer Info */}
                            {paymentInfo.customerInfo && (
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <User className="w-5 h-5 text-gray-500" />
                                        <span className="font-semibold text-gray-700">Thông tin khách hàng</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Họ tên:</span>
                                            <p className="font-medium">{paymentInfo.customerInfo.name}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Email:</span>
                                            <p className="font-medium">{paymentInfo.customerInfo.email}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Điện thoại:</span>
                                            <p className="font-medium">{paymentInfo.customerInfo.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                        <button
                            onClick={() => navigate("/order-history")}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                        >
                            Xem lịch sử đơn hàng
                        </button>

                        <button
                            onClick={() => navigate("/")}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                        >
                            Về trang chủ
                        </button>

                        <button
                            onClick={() => navigate("/menu")}
                            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors font-medium"
                        >
                            Tiếp tục mua sắm
                        </button>
                    </div>

                    {/* Note */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            💡 <strong>Lưu ý:</strong> Đơn hàng của bạn đang được xử lý. Chúng tôi sẽ gửi thông báo khi
                            đơn hàng được chuẩn bị và giao đến bạn.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
