import React, { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react"; // Icons from Lucide
import AddressChangePopup from "../components/AddressChangePopup";
import PaymentButton from "../components/PaymentButton";
import { useNavigate } from "react-router-dom";

const Payment = () => {
    const [address, setAddress] = useState("Phương Uyên (+84) 82868383 Tầng 1, Tòa B, UIT");
    const [deliveryTime, setDeliveryTime] = useState("Giao ngay (15 - 30 phút)");
    const [discountCode, setDiscountCode] = useState("BANMOINIFOODIE");
    const [paymentMethod, setPaymentMethod] = useState("Tiền mặt");
    const [showAddressPopup, setShowAddressPopup] = useState(false);
    const [showDiscountPopup, setShowDiscountPopup] = useState(false);

    const [receiverName, setReceiverName] = useState("Phương Uyên");
    const [phoneNumber, setPhoneNumber] = useState("082868383");
    const [newAddress, setNewAddress] = useState("Tầng 1, Tòa B, UIT");

    const [showTimePopup, setShowTimePopup] = useState(false);
    const [selectedTime, setSelectedTime] = useState("Giao ngay (15 - 30 phút)");

    const [tempDiscountCode, setTempDiscountCode] = useState(discountCode);

    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [tempPaymentMethod, setTempPaymentMethod] = useState(paymentMethod);

    const navigate = useNavigate();

    const [showOrderSuccess, setShowOrderSuccess] = useState(false);

    const totalPrice = 60000;
    const shippingFee = 10000;
    const discount = 20000;
    const totalAmount = totalPrice + shippingFee - discount;

    // Sample order items for payment
    const orderItems = [
        { name: "Bánh mì thịt", quantity: 1, price: 20000 },
        { name: "Bánh mì trứng", quantity: 1, price: 20000 },
        { name: "Nước uống", quantity: 1, price: 10000 },
    ];

    // Customer info for PayOS
    const customerInfo = {
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

    const handleDiscountCodeChange = (newDiscountCode) => {
        setDiscountCode(newDiscountCode);
        setShowDiscountPopup(false); // Close the popup after saving
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

                {/* Discount Code Section */}
                <div className="flex justify-between items-center mb-6 border p-4 border-gray-300 rounded-lg">
                    <div>
                        <h3 className="text-lg font-semibold">Mã giảm giá</h3>
                        <p>{discountCode}</p>
                    </div>
                    <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => {
                            setTempDiscountCode(discountCode); // giữ giá trị đang dùng
                            setShowDiscountPopup(true);
                        }}
                    >
                        Chọn mã giảm giá khác
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
                        <div className="flex justify-between text-lg font-medium mb-4">
                            <span>Tổng tiền hàng</span>
                            <span>{totalPrice.toLocaleString()}đ</span>
                        </div>
                        <div className="flex justify-between text-lg font-medium mb-4">
                            <span>Tổng tiền phí vận chuyển</span>
                            <span>{shippingFee.toLocaleString()}đ</span>
                        </div>
                        <div className="flex justify-between text-lg font-medium mb-4">
                            <span>Tổng cộng mã giảm giá</span>
                            <span>-{discount.toLocaleString()}đ</span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold mb-4">
                            <span>Tổng cần thanh toán</span>
                            <span>{totalAmount.toLocaleString()}đ</span>
                        </div>
                    </div>

                    {/* Đặt hàng Button */}
                    <div className="flex flex-col gap-3 mt-6">
                        {/* PayOS Payment Button - Recommended */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-blue-600 font-semibold">
                                    💳 Thanh toán trực tuyến (Khuyến nghị)
                                </span>
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    Nhanh & An toàn
                                </span>
                            </div>
                            <PaymentButton
                                orderId={orderId}
                                amount={totalAmount}
                                description={`Đơn hàng UniFoodie - ${orderItems.length} món`}
                                customerInfo={customerInfo}
                                items={orderItems}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
                                onSuccess={(result) => {
                                    console.log("PayOS payment created:", result);
                                    navigate("/payment-success", {
                                        state: {
                                            orderCode: result.orderCode,
                                            amount: totalAmount,
                                            items: orderItems,
                                            customerInfo,
                                        },
                                    });
                                }}
                                onError={(error) => {
                                    console.error("PayOS payment error:", error);
                                    alert("Tạo thanh toán PayOS thất bại: " + error.message);
                                }}
                            />
                            <p className="text-xs text-gray-600 mt-1">
                                Hỗ trợ thanh toán qua ngân hàng, ví điện tử và thẻ ATM
                            </p>
                        </div>

                        {/* Traditional Payment Button */}
                        <div className="text-center">
                            <div className="flex items-center my-3">
                                <div className="flex-1 border-t border-gray-300"></div>
                                <span className="px-3 text-gray-500 text-sm">hoặc</span>
                                <div className="flex-1 border-t border-gray-300"></div>
                            </div>

                            <button
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium"
                                onClick={() => {
                                    const onlineMethods = ["Chuyển khoản ngân hàng", "MOMO", "ZaloPay"];

                                    if (onlineMethods.includes(paymentMethod)) {
                                        navigate("/qr-payment", { state: { method: paymentMethod } });
                                    } else {
                                        setShowOrderSuccess(true); // Hiện popup
                                        setTimeout(() => {
                                            navigate("/cart"); // Quay về sau 3s
                                        }, 5000);
                                    }
                                }}
                            >
                                Đặt hàng với {paymentMethod}
                            </button>
                        </div>
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

            {/* Discount Code Change Popup */}
            {showDiscountPopup && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg w-96 shadow-lg">
                        <h3 className="text-2xl font-semibold mb-4">Chọn mã giảm giá</h3>
                        <input
                            type="text"
                            value={tempDiscountCode}
                            onChange={(e) => setTempDiscountCode(e.target.value)}
                            placeholder="Nhập mã giảm giá"
                            className="w-full border border-gray-300 p-2 mb-4 rounded-md"
                        />
                        <div className="flex justify-between">
                            <button
                                onClick={() => setShowDiscountPopup(false)}
                                className="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => {
                                    setDiscountCode(tempDiscountCode); // lưu mã mới
                                    setShowDiscountPopup(false);
                                }}
                                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                            >
                                Lưu
                            </button>
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
                                    label: "Tiền mặt",
                                    icon: "https://res.cloudinary.com/dbr85jktp/image/upload/v1748287327/CASH_ypopzk.png",
                                },
                                {
                                    label: "PayOS - Thanh toán trực tuyến",
                                    icon: "https://res.cloudinary.com/dai92e7cq/image/upload/v1748287590/payos-logo_hxqwdi.png",
                                },
                                {
                                    label: "Chuyển khoản ngân hàng",
                                    icon: "https://res.cloudinary.com/dbr85jktp/image/upload/v1748287444/1052854_s2yqyr.png",
                                },
                                {
                                    label: "MOMO",
                                    icon: "https://res.cloudinary.com/dbr85jktp/image/upload/v1748287326/momo_nor95x.webp",
                                },
                                {
                                    label: "ZaloPay",
                                    icon: "https://res.cloudinary.com/dbr85jktp/image/upload/v1748287327/idv2DAbjER_1748287277081_omlczg.jpg",
                                },
                            ].map((option) => (
                                <div
                                    key={option.label}
                                    onClick={() => setTempPaymentMethod(option.label)}
                                    className={`flex items-center gap-3 border px-4 py-3 mb-3 rounded-md cursor-pointer ${
                                        tempPaymentMethod === option.label
                                            ? "border-red-600 text-red-600 font-semibold"
                                            : "border-gray-300"
                                    }`}
                                >
                                    {/* Vòng tròn chứa hình ảnh */}
                                    <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 border border-gray-300 overflow-hidden">
                                        <img src={option.icon} alt={option.label} className="w-6 h-6 object-contain" />
                                    </div>

                                    {/* Nhãn phương thức */}
                                    <span className="text-base">{option.label}</span>
                                </div>
                            ))}

                            {/* Nút hành động */}
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
