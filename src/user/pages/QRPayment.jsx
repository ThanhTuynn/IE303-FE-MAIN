import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { QrCode, CheckCircle, XCircle, Clock, Smartphone } from "lucide-react";

const QRPayment = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [paymentStatus, setPaymentStatus] = useState("pending");
    const [countdown, setCountdown] = useState(15);

    const orderCode = searchParams.get("orderCode");
    const amount = searchParams.get("amount") || "50000";
    const orderId = searchParams.get("orderId");

    useEffect(() => {
        if (!orderCode) {
            navigate("/cart");
            return;
        }

        // Countdown timer
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Auto-success popup after 10 seconds
        const successTimer = setTimeout(() => {
            setPaymentStatus("pending-confirmation");
        }, 10000);

        return () => {
            clearInterval(timer);
            clearTimeout(successTimer);
        };
    }, [orderCode, navigate]);

    const handlePaymentComplete = (status) => {
        setPaymentStatus(status);

        // Redirect back to backend return URL to complete the flow
        setTimeout(() => {
            const returnUrl = `http://localhost:8080/api/payments/return?orderCode=${orderCode}&status=${status}&method=qr`;
            window.location.href = returnUrl;
        }, 2000);
    };

    const handleManualConfirm = (status) => {
        setPaymentStatus(status);
        setTimeout(() => {
            const returnUrl = `http://localhost:8080/api/payments/return?orderCode=${orderCode}&status=${status}&method=qr`;
            window.location.href = returnUrl;
        }, 1500);
    };

    if (paymentStatus === "success") {
        return (
            <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h1>
                    <p className="text-gray-600 mb-4">Đang xử lý đơn hàng...</p>
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

    if (paymentStatus === "pending-confirmation") {
        return (
            <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <Smartphone className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Xác nhận thanh toán</h1>
                    <p className="text-gray-600 mb-6">Bạn đã quét mã QR và thực hiện thanh toán chưa?</p>

                    <div className="space-y-3">
                        <button
                            onClick={() => handleManualConfirm("success")}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors font-semibold"
                        >
                            ✅ Đã thanh toán thành công
                        </button>

                        <button
                            onClick={() => handleManualConfirm("failed")}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors"
                        >
                            ❌ Thanh toán thất bại
                        </button>

                        <button
                            onClick={() => navigate("/cart")}
                            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg transition-colors"
                        >
                            🔙 Quay lại giỏ hàng
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <QrCode className="w-10 h-10 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán QR</h1>
                    <p className="text-gray-600">Quét mã QR để thanh toán nhanh chóng</p>
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
                            <span className="font-medium">QR Payment</span>
                        </div>
                    </div>
                </div>

                {/* QR Code Placeholder */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6 text-center">
                    <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                        <QrCode className="w-32 h-32 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">Mã QR sẽ được tạo bởi ứng dụng ngân hàng</p>
                </div>

                {/* Instructions */}
                <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Hướng dẫn thanh toán:</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-start gap-2">
                            <span className="font-semibold text-blue-600">1.</span>
                            <span>Mở ứng dụng ngân hàng trên điện thoại</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="font-semibold text-blue-600">2.</span>
                            <span>Chọn chức năng quét mã QR</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="font-semibold text-blue-600">3.</span>
                            <span>Quét mã QR và xác nhận thanh toán</span>
                        </div>
                    </div>
                </div>

                {/* Auto-redirect countdown */}
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">Tự động kiểm tra trong {countdown}s</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${((15 - countdown) / 15) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Manual Actions */}
                <div className="space-y-3">
                    <button
                        onClick={() => handlePaymentComplete("success")}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors font-semibold"
                    >
                        ✅ Tôi đã thanh toán thành công
                    </button>

                    <button
                        onClick={() => navigate("/cart")}
                        className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg transition-colors"
                    >
                        🔙 Quay lại giỏ hàng
                    </button>
                </div>

                {/* Note */}
                <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                        💡 <strong>Lưu ý:</strong> Đây là phương thức thanh toán dự phòng khi PayOS không khả dụng.
                        Trong thực tế, bạn sẽ được chuyển trực tiếp đến cổng thanh toán PayOS.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QRPayment;
