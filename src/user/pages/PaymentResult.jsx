import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { XCircle, AlertCircle, ArrowLeft, Receipt, User } from "lucide-react";
import cartService from "../services/cartService";

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const orderCode = searchParams.get("orderCode");
    const status = searchParams.get("status");
    const error = searchParams.get("error");

    useEffect(() => {
        const fetchPaymentInfo = async () => {
            console.log("📊 PaymentResult - Status:", status, "OrderCode:", orderCode);

            // Log that cart will NOT be cleared for failed/cancelled payments
            if (status === "cancelled" || status === "failed") {
                console.log("🛒 Payment failed/cancelled - Cart will NOT be cleared, items preserved");

                // Try to restore cart from backup if it was cleared
                console.log("🔄 Attempting to restore cart from backup...");
                const restoreResult = await cartService.restoreCart();
                if (restoreResult.success) {
                    console.log(`✅ Cart restored successfully! ${restoreResult.restoredCount} items restored`);
                } else {
                    console.log("ℹ️ No cart backup to restore or cart is already intact");
                }
            }

            if (orderCode) {
                try {
                    const response = await fetch(`http://localhost:8080/api/payments/status/${orderCode}`);
                    if (response.ok) {
                        const result = await response.json();
                        setPaymentInfo(result.data);
                    }
                } catch (error) {
                    console.error("Error fetching payment info:", error);
                }
            }

            // If we have state data from navigation, use it
            const stateData = location.state;
            if (stateData) {
                setPaymentInfo({
                    orderCode: stateData.orderCode,
                    orderId: stateData.orderId || `ORDER_${stateData.orderCode}`,
                    amount: stateData.amount,
                    status: status?.toUpperCase() || "FAILED",
                    items: stateData.items,
                    customerInfo: stateData.customerInfo,
                });
            }

            setLoading(false);
        };

        fetchPaymentInfo();
    }, [orderCode, status, location.state]);

    const getStatusInfo = () => {
        switch (status) {
            case "cancelled":
                return {
                    icon: XCircle,
                    color: "text-yellow-500",
                    bgColor: "bg-yellow-50",
                    borderColor: "border-yellow-200",
                    textColor: "text-yellow-800",
                    title: "Thanh toán đã bị hủy",
                    message: "Bạn đã hủy giao dịch thanh toán",
                    statusText: "❌ Đã hủy",
                };
            case "failed":
                return {
                    icon: XCircle,
                    color: "text-red-500",
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200",
                    textColor: "text-red-800",
                    title: "Thanh toán thất bại",
                    message: "Có lỗi xảy ra trong quá trình thanh toán",
                    statusText: "❌ Thất bại",
                };
            default:
                return {
                    icon: AlertCircle,
                    color: "text-gray-500",
                    bgColor: "bg-gray-50",
                    borderColor: "border-gray-200",
                    textColor: "text-gray-800",
                    title: "Có lỗi xảy ra",
                    message: "Vui lòng thử lại sau",
                    statusText: "❓ Không xác định",
                };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    const statusInfo = getStatusInfo();
    const StatusIcon = statusInfo.icon;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    {/* Status Header */}
                    <div className="text-center mb-8">
                        <StatusIcon className={`w-16 h-16 ${statusInfo.color} mx-auto mb-4`} />
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{statusInfo.title}</h1>
                        <p className="text-gray-600">{statusInfo.message}</p>

                        {/* Cart preserved notification for failed/cancelled payments */}
                        {(status === "cancelled" || status === "failed") && (
                            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-md mx-auto">
                                <p className="text-sm text-blue-800">
                                    ✅ Giỏ hàng của bạn vẫn được giữ nguyên. Bạn có thể thử thanh toán lại.
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
                                            <p className={`font-medium ${statusInfo.color}`}>{statusInfo.statusText}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
                            onClick={() => navigate("/cart")}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                        >
                            Quay lại giỏ hàng
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
                    <div className={`mt-6 p-4 ${statusInfo.bgColor} border ${statusInfo.borderColor} rounded-lg`}>
                        <p className={`text-sm ${statusInfo.textColor}`}>
                            {status === "cancelled"
                                ? "💡 Đơn hàng của bạn vẫn được lưu trong giỏ hàng. Bạn có thể thử thanh toán lại bất cứ lúc nào."
                                : "💡 Nếu bạn gặp vấn đề với thanh toán, vui lòng liên hệ với chúng tôi qua hotline hoặc thử lại sau."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentResult;
