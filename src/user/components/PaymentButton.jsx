import React, { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { paymentService } from "../services/paymentService";

const PaymentButton = ({
    orderId,
    amount,
    description,
    customerInfo,
    items = [],
    onSuccess,
    onError,
    className = "",
}) => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);

        try {
            const paymentData = {
                orderId,
                amount,
                description,
                customerName: customerInfo?.name || "Khách hàng",
                customerEmail: customerInfo?.email || "",
                customerPhone: customerInfo?.phone || "",
                items:
                    items.length > 0
                        ? items
                        : [
                              {
                                  name: description || "Đơn hàng UniFoodie",
                                  quantity: 1,
                                  price: amount,
                              },
                          ],
            };

            console.log("Creating payment with data:", paymentData);

            const result = await paymentService.createPayment(paymentData);
            console.log("Payment response:", result);

            if (result.status === "success") {
                // Store payment info in localStorage for tracking
                localStorage.setItem(
                    "currentPayment",
                    JSON.stringify({
                        orderCode: result.orderCode,
                        orderId: orderId,
                        amount: amount,
                        customerInfo: customerInfo,
                        items: items,
                    })
                );

                // Redirect to payment URL - DO NOT call onSuccess here
                // onSuccess will be called when user returns from PayOS
                window.location.href = result.paymentUrl;

                // Don't call onSuccess here as payment is not completed yet
                // if (onSuccess) {
                //     onSuccess(result);
                // }
            } else {
                throw new Error(result.message || "Failed to create payment");
            }
        } catch (error) {
            console.error("Payment error:", error);
            if (onError) {
                onError(error);
            } else {
                alert("Có lỗi xảy ra khi tạo thanh toán: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className={`
                flex items-center justify-center gap-2 px-6 py-3 
                bg-red-600 hover:bg-red-700 text-white rounded-lg 
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                ${className}
            `}
        >
            {loading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xử lý...
                </>
            ) : (
                <>
                    <CreditCard className="w-4 h-4" />
                    Thanh toán {amount?.toLocaleString("vi-VN")} VNĐ
                </>
            )}
        </button>
    );
};

export default PaymentButton;
