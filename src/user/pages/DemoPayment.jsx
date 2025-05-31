import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CreditCard, CheckCircle, XCircle, Clock } from "lucide-react";

const DemoPayment = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [paymentStatus, setPaymentStatus] = useState("pending");
    const [countdown, setCountdown] = useState(5);

    const orderCode = searchParams.get("orderCode");
    const amount = searchParams.get("amount") || "50000";

    useEffect(() => {
        if (!orderCode) {
            navigate("/cart");
            return;
        }

        // Simulate payment processing
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    // Auto-complete payment after countdown
                    handlePaymentComplete("success");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [orderCode, navigate]);

    const handlePaymentComplete = (status) => {
        setPaymentStatus(status);

        // Redirect back to backend return URL to complete the flow
        setTimeout(() => {
            const returnUrl = `http://localhost:8080/api/payments/return?orderCode=${orderCode}&status=${status}&demo=true`;
            window.location.href = returnUrl;
        }, 2000);
    };

    if (paymentStatus === "success") {
        return (
            <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h1>
                    <p className="text-gray-600 mb-4">Đang chuyển hướng...</p>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (paymentStatus === "failed") {
        return (
            <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thất bại!</h1>
                    <p className="text-gray-600 mb-4">Đang chuyển hướng...</p>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Demo PayOS Payment</h1>
                    <p className="text-gray-600">Đang xử lý thanh toán...</p>
                </div>

                {/* Payment Info */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Mã đơn hàng:</span>
                            <span className="font-medium">{orderCode}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Số tiền:</span>
                            <span className="font-bold text-red-600 text-lg">
                                {parseInt(amount).toLocaleString("vi-VN")} VNĐ
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Phương thức:</span>
                            <span className="font-medium">Demo PayOS</span>
                        </div>
                    </div>
                </div>

                {/* Auto-processing */}
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">Tự động hoàn thành trong {countdown}s</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => handlePaymentComplete("success")}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors"
                    >
                        ✓ Mô phỏng thanh toán thành công
                    </button>

                    <button
                        onClick={() => handlePaymentComplete("failed")}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors"
                    >
                        ✗ Mô phỏng thanh toán thất bại
                    </button>

                    <button
                        onClick={() => navigate("/cart")}
                        className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg transition-colors"
                    >
                        Quay lại giỏ hàng
                    </button>
                </div>

                {/* Note */}
                <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        💡 <strong>Lưu ý:</strong> Đây là trang demo PayOS. Trong production, bạn sẽ được chuyển đến
                        trang thanh toán thực của PayOS.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DemoPayment;
