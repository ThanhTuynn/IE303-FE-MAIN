import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const QRPayment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { method } = location.state || {};
    const [showPopup, setShowPopup] = useState(false);

    const qrMap = {
        MOMO: "https://res.cloudinary.com/dbr85jktp/image/upload/v1748288762/QRZALOPAY_w6o2do.jpg",
        ZaloPay: "https://res.cloudinary.com/dbr85jktp/image/upload/v1748288762/QRZALOPAY_w6o2do.jpg",
        "Chuyển khoản ngân hàng": "https://res.cloudinary.com/dbr85jktp/image/upload/v1748288762/QRZALOPAY_w6o2do.jpg",
    };

    useEffect(() => {
        const popupTimer = setTimeout(() => {
            setShowPopup(true);
        }, 10000);

        const redirectTimer = setTimeout(() => {
            navigate("/cart");
        }, 15000);

        return () => {
            clearTimeout(popupTimer);
            clearTimeout(redirectTimer);
        };
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-6 relative">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Quét mã để thanh toán</h1>
            <p className="text-lg mb-2">
                Phương thức: <strong>{method}</strong>
            </p>

            {qrMap[method] ? (
                <img
                    src={qrMap[method]}
                    alt={`QR cho ${method}`}
                    className="w-60 h-60 object-contain border p-2 bg-white shadow-md rounded mb-6"
                />
            ) : (
                <p className="text-red-500 mt-4">Không tìm thấy mã QR cho phương thức này.</p>
            )}

            {/* POPUP */}
            {showPopup && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-sm w-full">
                        <h2 className="text-2xl font-bold text-green-600 mb-4">Đã thanh toán thành công!</h2>
                        <p className="text-gray-700">Bạn sẽ được chuyển về giỏ hàng trong giây lát...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QRPayment;
