import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false); // State quản lý hiển thị mật khẩu
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State quản lý hiển thị mật khẩu xác nhận

  // Hàm toggle hiển thị mật khẩu
  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

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
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Họ và tên"
                className="w-full border-b border-gray-400 py-2 bg-transparent focus:outline-none"
              />
              <input
                type="text"
                placeholder="Tên đăng nhập"
                className="w-full border-b border-gray-400 py-2 bg-transparent focus:outline-none"
              />
              <input
                type="email"
                placeholder="Địa chỉ email"
                className="w-full border-b border-gray-400 py-2 bg-transparent focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Số điện thoại"
                className="w-full border-b border-gray-400 py-2 bg-transparent focus:outline-none"
              />
              {/* Mật khẩu */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mật khẩu"
                  className="w-full border-b border-gray-400 py-2 bg-transparent focus:outline-none"
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
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Xác nhận mật khẩu"
                  className="w-full border-b border-gray-400 py-2 bg-transparent focus:outline-none"
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
                Bạn đã có tài khoản?{' '}
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
