import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { XCircle, ArrowLeft, ShoppingCart, Receipt } from "lucide-react";

const PaymentCancelled = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const orderCode = searchParams.get("orderCode");
    const cancelled = searchParams.get("cancelled");
    const status = searchParams.get("status");

    useEffect(() => {
        console.log("💔 Payment cancelled/failed:", { orderCode, cancelled, status });
        // Do NOT clear cart - items should remain for user to retry
    }, [orderCode, cancelled, status]);

    const getTitle = () => {
        if (cancelled === "true") {
            return "Thanh toán đã bị hủy";
        }
        if (status === "FAILED") {
            return "Thanh toán thất bại";
        }
        return "Thanh toán không thành công";
    };

    const getMessage = () => {
        if (cancelled === "true") {
            return "Bạn đã hủy giao dịch thanh toán";
        }
        if (status === "FAILED") {
            return "Giao dịch thanh toán không thể hoàn tất";
        }
        return "Có lỗi xảy ra trong quá trình thanh toán";
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    {/* Failed Header */}
                    <div className="text-center mb-8">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{getTitle()}</h1>
                        <p className="text-gray-600">{getMessage()}</p>
                    </div>

                    {/* Order Info if available */}
                    {orderCode && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Receipt className="w-5 h-5 text-red-500" />
                                <span className="font-semibold text-red-700">Thông tin giao dịch</span>
                            </div>
                            <div className="text-sm text-red-800">
                                <p>
                                    <strong>Mã giao dịch:</strong> {orderCode}
                                </p>
                                <p>
                                    <strong>Trạng thái:</strong> {cancelled === "true" ? "Đã hủy" : "Thất bại"}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Important Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                        <h3 className="font-semibold text-blue-800 mb-2">✅ Đừng lo lắng!</h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Giỏ hàng của bạn vẫn được giữ nguyên</li>
                            <li>• Không có khoản phí nào được trừ</li>
                            <li>• Bạn có thể thử thanh toán lại</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => navigate("/cart")}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Quay lại giỏ hàng
                        </button>

                        <button
                            onClick={() => navigate("/menu")}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                        >
                            Tiếp tục mua sắm
                        </button>

                        <button
                            onClick={() => navigate("/")}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Về trang chủ
                        </button>
                    </div>

                    {/* Help Section */}
                    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-semibold text-yellow-800 mb-2">💡 Gợi ý</h4>
                        <div className="text-sm text-yellow-700 space-y-1">
                            <p>• Thử sử dụng phương thức thanh toán khác</p>
                            <p>• Kiểm tra kết nối internet và thông tin thẻ</p>
                            <p>• Hoặc chọn thanh toán khi nhận hàng</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancelled;
