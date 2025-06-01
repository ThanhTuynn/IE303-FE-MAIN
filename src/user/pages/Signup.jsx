import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import useNotification from "../hooks/useNotification";

const Signup = () => {
    const navigate = useNavigate();
    const notify = useNotification();
    // State quản lý dữ liệu form
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        address: "",
        phone: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Hàm cập nhật state khi input thay đổi
    const handleInputChange = (e) => {
        const { placeholder, value } = e.target;
        let fieldName = "";
        // Ánh xạ placeholder sang tên trường trong state
        switch (placeholder) {
            case "Họ và tên":
                fieldName = "fullName";
                break;
            case "Tên đăng nhập":
                fieldName = "username";
                break;
            case "Địa chỉ email":
                fieldName = "email";
                break;
            case "Số điện thoại":
                fieldName = "phoneNumber";
                break;
            case "Mật khẩu":
                fieldName = "password";
                break;
            case "Xác nhận mật khẩu":
                fieldName = "confirmPassword";
                break;
            case "Địa chỉ":
                fieldName = "address";
                break;
            case "Số điện thoại":
                fieldName = "phone";
                break;
            default:
                return; // Bỏ qua các input không khớp
        }
        setFormData({ ...formData, [fieldName]: value });
    };

    // Hàm toggle hiển thị mật khẩu
    const togglePassword = () => setShowPassword(!showPassword);
    const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    // Hàm xử lý submit form
    const handleSubmit = async (event) => {
        event.preventDefault(); // Ngăn chặn submit form mặc định

        // Kiểm tra mật khẩu khớp
        if (formData.password !== formData.confirmPassword) {
            notify.error("Mật khẩu và xác nhận mật khẩu không khớp!");
            return;
        }

        // Chuẩn bị dữ liệu gửi đi (loại bỏ confirmPassword)
        const { confirmPassword, ...dataToSend } = formData;
        // Backend sẽ tự gán role và createdAt

        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            const result = await response.json(); // Backend trả về RegisterResponse { success: boolean, message: string }

            if (response.ok && result.success) {
                // Kiểm tra status 200 và success: true
                notify.success("Đăng ký thành công! Vui lòng đăng nhập.");
                // Chuyển hướng đến trang đăng nhập
                // Lưu ý: Bạn cần cấu hình React Router hoặc tương tự để chuyển hướng
                navigate("/login"); // Ví dụ chuyển hướng đơn giản
            } else {
                // Xử lý lỗi từ backend
                notify.error("Đăng ký thất bại: " + (result.message || "Có lỗi xảy ra."));
            }
        } catch (error) {
            console.error("Error during registration:", error);
            notify.error("Đã xảy ra lỗi kết nối đến server. Vui lòng thử lại.");
        }
    };

    return (
        <div className="min-h-screen bg-[#f9f9f9] font-kanit flex flex-col">
            {/* Main Content */}
            <div className="flex flex-col md:flex-row flex-grow">
                {/* Left Side – Hình ảnh + slogan */}
                <div className="w-full md:w-1/2 bg-[#fff3e7] flex items-center justify-center px-6 py-12">
                    <div className="w-full">
                        <img
                            src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746435511/i_m_avery_davis_500_x_1000_mm_eykih5.png"
                            alt="UniFoodie Dish"
                            className="w-full h-auto"
                        />
                    </div>
                </div>

                {/* Right Side – Form đăng ký */}
                <div className="w-full md:w-1/2 bg-[#fefcf9] flex items-center justify-center px-6 pt-0 pb-12">
                    <div className="w-full max-w-md">
                        <h2 className="text-5xl font-bold text-black mb-6 text-left">ĐĂNG KÝ</h2>
                        {/* Gắn handleSubmit vào form */}
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Họ và tên"
                                className="w-full border-b border-gray-400 py-2 bg-transparent focus:outline-none"
                                value={formData.fullName}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                placeholder="Tên đăng nhập"
                                className="w-full border-b border-gray-400 py-2 bg-transparent focus:outline-none"
                                value={formData.username}
                                onChange={handleInputChange}
                            />
                            <input
                                type="email"
                                placeholder="Địa chỉ email"
                                className="w-full border-b border-gray-400 py-2 bg-transparent focus:outline-none"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                            <input
                                type="tel"
                                placeholder="Số điện thoại"
                                className="w-full border-b border-gray-400 py-2 bg-transparent focus:outline-none"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                            />
                            {/* Mật khẩu */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Mật khẩu"
                                    className="w-full border-b border-gray-400 py-2 bg-transparent focus:outline-none"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                                <button
                                    type="button"
                                    onClick={togglePassword}
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>

                            {/* Xác nhận mật khẩu */}
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Xác nhận mật khẩu"
                                    className="w-full border-b border-gray-400 py-2 bg-transparent focus:outline-none"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPassword}
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-full mt-6 shadow"
                            >
                                Đăng ký
                            </button>
                            <p className="text-sm text-center mt-4">
                                Bạn đã có tài khoản?{" "}
                                <a href="/login" className="text-red-600 font-semibold">
                                    Đăng nhập
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
