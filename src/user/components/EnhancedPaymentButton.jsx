import React, { useState } from "react";
import { CreditCard, Loader2, CheckCircle } from "lucide-react";
import { orderService } from "../services/orderService";
import { paymentService } from "../services/paymentService";

const EnhancedPaymentButton = ({
    userId,
    orderItems,
    deliveryAddress,
    paymentMethod = "PayOS",
    specialInstructions = "",
    customerInfo,
    onSuccess,
    onError,
    className = "",
    disabled = false,
}) => {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(""); // "creating-order", "creating-payment", "redirecting"

    const handleEnhancedPayment = async () => {
        // Check if user is logged in
        if (!userId || userId === "1") {
            if (onError) {
                onError(new Error("Vui lòng đăng nhập để đặt hàng"));
            } else {
                alert("Vui lòng đăng nhập để đặt hàng");
            }
            return;
        }

        // Check if button is disabled
        if (disabled) {
            return;
        }

        setLoading(true);

        try {
            // Step 1: Create Order first
            setStep("creating-order");
            console.log("🛒 Step 1: Creating order...");

            const orderResult = await orderService.createOrderFromPaymentItems({
                userId,
                orderItems,
                deliveryAddress,
                paymentMethod,
                specialInstructions,
            });

            if (!orderResult.success) {
                throw new Error(orderResult.message || "Failed to create order");
            }

            const createdOrder = orderResult.data;
            console.log("✅ Order created successfully:", createdOrder);

            // Step 2: Create Payment linked to Order
            setStep("creating-payment");
            console.log("💳 Step 2: Creating payment for order:", createdOrder.id);

            // ✅ FIX: PayOS description max 25 characters
            const shortOrderId = createdOrder.id.substring(createdOrder.id.length - 6); // Last 6 chars
            const shortDescription = `Don #${shortOrderId}`; // "Don #abc123" = 11 chars max

            console.log("📝 Description for PayOS:", shortDescription, `(${shortDescription.length} chars)`);

            const paymentData = {
                orderId: createdOrder.id, // Use actual Order ID from database
                amount: Math.round(createdOrder.totalAmount),
                description: shortDescription, // ✅ Short description for PayOS
                customerName: customerInfo?.name || "Khách hàng",
                customerEmail: customerInfo?.email || "",
                customerPhone: customerInfo?.phone || "",
                items: orderItems.map((item) => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: Math.round(item.price),
                })),
            };

            const paymentResult = await paymentService.createPayment(paymentData);
            console.log("✅ Payment created successfully:", paymentResult);

            if (paymentResult.status === "success") {
                // Store comprehensive info for tracking
                setStep("redirecting");

                const trackingData = {
                    orderId: createdOrder.id,
                    orderCode: paymentResult.orderCode,
                    amount: createdOrder.totalAmount,
                    orderStatus: createdOrder.status,
                    paymentStatus: createdOrder.paymentStatus,
                    customerInfo: customerInfo,
                    items: orderItems,
                    createdAt: createdOrder.createdAt,
                };

                localStorage.setItem("currentPayment", JSON.stringify(trackingData));

                console.log("🚀 Redirecting to payment URL:", paymentResult.paymentUrl);
                console.log("📦 Payment type:", paymentResult.paymentType || "unknown");

                // ✅ FIXED: Don't call onSuccess until payment is actually completed
                // Only redirect to payment gateway

                // Check payment method and handle accordingly
                if (paymentMethod === "Tiền mặt" || paymentMethod === "Cash") {
                    console.log("💰 Cash payment - call success immediately");
                    // For cash payments, call success immediately since no external payment needed
                    if (onSuccess) {
                        onSuccess({
                            order: createdOrder,
                            payment: paymentResult,
                            trackingData,
                        });
                    }
                } else {
                    // For PayOS/QR payments, redirect to payment gateway
                    // Don't call onSuccess here - it will be handled by return URL
                    if (
                        paymentResult.paymentUrl.includes("payos.vn") ||
                        paymentResult.paymentType === "payos-checkout"
                    ) {
                        console.log("🎯 Redirecting to real PayOS checkout...");
                        window.location.href = paymentResult.paymentUrl;
                    } else if (paymentResult.paymentUrl.includes("qr-payment")) {
                        console.log("📱 Redirecting to QR payment fallback...");
                        window.location.href = paymentResult.paymentUrl;
                    } else {
                        console.log("🔄 Redirecting to payment URL:", paymentResult.paymentUrl);
                        window.location.href = paymentResult.paymentUrl;
                    }
                }
            } else {
                throw new Error(paymentResult.message || "Failed to create payment");
            }
        } catch (error) {
            console.error("❌ Enhanced payment error:", error);
            setStep("");

            if (onError) {
                onError(error);
            } else {
                alert("Có lỗi xảy ra: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const getStepText = () => {
        if (disabled || !userId || userId === "1") {
            return "Đăng nhập để đặt hàng";
        }

        switch (step) {
            case "creating-order":
                return "Đang tạo đơn hàng...";
            case "creating-payment":
                return "Đang tạo thanh toán...";
            case "redirecting":
                return "Đang chuyển hướng...";
            default:
                return "Đặt hàng và thanh toán";
        }
    };

    const getStepIcon = () => {
        if (step === "redirecting") {
            return <CheckCircle className="w-4 h-4" />;
        }
        if (loading) {
            return <Loader2 className="w-4 h-4 animate-spin" />;
        }
        return <CreditCard className="w-4 h-4" />;
    };

    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const isDisabled = disabled || loading || !userId || userId === "1";

    return (
        <button
            onClick={handleEnhancedPayment}
            disabled={isDisabled}
            className={`
                flex items-center justify-center gap-2 px-6 py-3 
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                ${className}
            `}
        >
            {getStepIcon()}
            <div className="flex flex-col items-center">
                <span className="text-sm font-medium">{getStepText()}</span>
                {!loading && !disabled && userId && userId !== "1" && (
                    <span className="text-xs opacity-80">{totalAmount.toLocaleString("vi-VN")} VNĐ</span>
                )}
            </div>
        </button>
    );
};

export default EnhancedPaymentButton;
