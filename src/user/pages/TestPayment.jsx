import React, { useState } from "react";
import PaymentButton from "../components/PaymentButton";
import { ShoppingCart, User, CreditCard } from "lucide-react";

const TestPayment = () => {
    const [customerInfo, setCustomerInfo] = useState({
        name: "Nguyễn Văn A",
        email: "test@example.com",
        phone: "0123456789",
    });

    const [cartItems] = useState([
        {
            id: 1,
            name: "Phở Bò",
            price: 35000,
            quantity: 1,
            image: "https://res.cloudinary.com/dai92e7cq/image/upload/v1746704366/Ph%E1%BB%9F_B%C3%B2_j3iroc.jpg",
        },
        {
            id: 2,
            name: "Trà Đá",
            price: 15000,
            quantity: 2,
            image: "https://res.cloudinary.com/dai92e7cq/image/upload/v1746704697/Tr%C3%A0_%C4%91%C3%A1_zwwyhj.jpg",
        },
    ]);

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderId = `ORDER_${Date.now()}`;

    const paymentItems = cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
    }));

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Payment Integration</h1>
                    <p className="text-gray-600">Demo tích hợp PayOS cho UniFoodie</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Customer Info */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <User className="w-5 h-5 text-red-600" />
                            <h2 className="text-xl font-semibold text-gray-900">Thông tin khách hàng</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                                <input
                                    type="text"
                                    value={customerInfo.name}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={customerInfo.email}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                <input
                                    type="tel"
                                    value={customerInfo.phone}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <ShoppingCart className="w-5 h-5 text-red-600" />
                            <h2 className="text-xl font-semibold text-gray-900">Giỏ hàng</h2>
                        </div>

                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                                        <p className="text-sm text-gray-600">
                                            {item.price.toLocaleString("vi-VN")} VNĐ x {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-red-600">
                                            {(item.price * item.quantity).toLocaleString("vi-VN")} VNĐ
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Total */}
                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                                    <span className="text-xl font-bold text-red-600">
                                        {totalAmount.toLocaleString("vi-VN")} VNĐ
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Section */}
                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <CreditCard className="w-5 h-5 text-red-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Thanh toán</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium text-gray-900 mb-2">Chi tiết đơn hàng</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <div className="flex justify-between">
                                    <span>Mã đơn hàng:</span>
                                    <span className="font-mono">{orderId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Số lượng món:</span>
                                    <span>{cartItems.length} món</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Khách hàng:</span>
                                    <span>{customerInfo.name}</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <PaymentButton
                                orderId={orderId}
                                amount={totalAmount}
                                description={`Đơn hàng UniFoodie - ${cartItems.length} món`}
                                customerInfo={customerInfo}
                                items={paymentItems}
                                className="w-full max-w-md"
                                onSuccess={(result) => {
                                    console.log("Payment created successfully:", result);
                                    alert("Payment link created! Check console for details.");
                                }}
                                onError={(error) => {
                                    console.error("Payment error:", error);
                                    alert("Payment failed: " + error.message);
                                }}
                            />
                        </div>

                        <div className="text-center text-sm text-gray-500">
                            Bằng việc thanh toán, bạn đồng ý với điều khoản sử dụng của UniFoodie
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestPayment;
