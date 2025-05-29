import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-kanit flex flex-col ">
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

        {/* Right Side – Form đăng nhập */}
        <div className="w-full md:w-1/2 bg-[#fefcf9] flex items-center justify-center px-6 pt-0 pb-12">
          <div className="w-full max-w-md">
            <h2 className="text-5xl font-bold text-black mb-6 text-left">ĐĂNG NHẬP</h2>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Địa chỉ email hoặc số điện thoại của bạn *"
                className="w-full border-b border-gray-400 py-2 bg-transparent focus:outline-none"
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mật khẩu *"
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
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-full mt-6 shadow"
              >
                Đăng nhập
              </button>
              <p className="text-sm text-center mt-4">
                Bạn quên mật khẩu?{' '}
                <a href="/reset-password" className="text-red-600 font-semibold">
                  Quên mật khẩu
                </a>
              </p>

              <div className="text-center mt-4">
                <p className="text-sm">Hoặc tiếp tục với</p>
               
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full mt-2"
                  type="button"
                >
                  Đăng nhập bằng Google
                </button>
              </div>

              <p className="text-sm text-center mt-4">
                Bạn chưa có tài khoản?{' '}
                <a href="/signup" className="text-red-600 font-semibold">
                  Đăng ký
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
