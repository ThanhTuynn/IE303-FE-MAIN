import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Hàm cập nhật state khi input thay đổi
  const handleInputChange = (e) => {
    const { placeholder, value } = e.target;
    // Ánh xạ placeholder sang tên trường trong state
    if (placeholder === 'Tên đăng nhập hoặc Email của bạn *') { // Cập nhật placeholder
      setFormData({ ...formData, usernameOrEmail: value });
    } else if (placeholder === 'Mật khẩu *') {
      setFormData({ ...formData, password: value });
    }
  };

  const togglePassword = () => setShowPassword(!showPassword);

  // Hàm xử lý submit form
  const handleSubmit = async (event) => {
    event.preventDefault(); // Ngăn chặn submit form mặc định
    setError('');

    // Chuẩn bị dữ liệu gửi đi
    // Backend API login của bạn nhận 'username' và 'password'
    // Cần đảm bảo backend xử lý login bằng username HOẶC email HOẶC sdt
    // Dựa trên code backend hiện tại, API login chỉ nhận 'username'.
    // Nếu bạn muốn login bằng email hoặc số điện thoại, cần sửa backend.
    // Tạm thời, gửi trường 'username' với giá trị từ input
    const dataToSend = {
        username: formData.usernameOrEmail, // Giả định input là username/email/sdt tùy backend xử lý
        password: formData.password
    };

    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json(); // Backend trả về { token: '...', user: {...} } hoặc { error: '...' }

      if (response.ok) { // Kiểm tra status code 200 (thành công)
        // Lưu token vào localStorage
        localStorage.setItem('jwtToken', result.token);
        // Tùy chọn: lưu thông tin user (không lưu mật khẩu!) để dùng hiển thị trên frontend
        localStorage.setItem('userData', JSON.stringify(result.user));

        // Kiểm tra role và điều hướng
        const userRole = result.user.role?.toLowerCase();
        if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else { // Xử lý lỗi (ví dụ: 401 Unauthorized) hoặc lỗi từ backend trả về
        setError(result.error || 'Sai tên đăng nhập hoặc mật khẩu.');
      }

    } catch (error) {
      console.error('Error during login:', error);
      setError('Đã xảy ra lỗi kết nối đến server. Vui lòng thử lại.');
    }
  };

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
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text" // Đổi từ email sang text để người dùng nhập cả username, email hoặc sdt
                placeholder="Tên đăng nhập hoặc Email của bạn *" // Cập nhật placeholder cho rõ ràng hơn
                className="w-full border-b border-gray-400 py-2 bg-transparent focus:outline-none"
                value={formData.usernameOrEmail}
                onChange={handleInputChange}
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mật khẩu *"
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full mt-2" // Example for Google login, not implemented yet
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
