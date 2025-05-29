import React, { useState } from 'react';
import { FaUser, FaLock, FaBell, FaSignOutAlt, FaHeart, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Mật khẩu mới và xác nhận không khớp.");
      return;
    }
    alert("Đổi mật khẩu thành công!");
    navigate('/personal-information');
  };

  const handleCancel = () => {
    navigate('/personal-information');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-start font-kanit">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow p-6 gap-6 max-w-5xl w-full">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 border rounded-lg p-4 text-center flex flex-col items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/706/706830.png"
            alt="avatar"
            className="w-24 h-24 rounded-full mb-3"
          />
          <h3 className="text-red-600 font-bold text-lg">Võ Thị Phương Uyên</h3>
          <p className="text-black font-medium">pu0406@</p>

          <ul className="mt-6 w-full space-y-3 text-left">
            <li>
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center w-full text-left px-2 py-2 rounded hover:bg-gray-100 text-gray-700 hover:text-red-600"
              >
                <FaUser className="mr-2" />
                Thông tin cá nhân
              </button>
            </li>
            <li>
              <button
                className="flex items-center w-full text-left px-2 py-2 rounded text-red-600 font-semibold bg-gray-100"
              >
                <FaLock className="mr-2" />
                Đổi mật khẩu
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/notifications')}
                className="flex items-center w-full text-left px-2 py-2 rounded hover:bg-gray-100 text-gray-700 hover:text-red-600"
              >
                <FaBell className="mr-2" />
                Thông báo
              </button>
            </li>
              <li>
                <button
                  className="flex items-center text-gray-700 hover:text-red-600 w-full text-left hover:bg-gray-100 px-2 py-2 rounded"
                  onClick={() => navigate('/favourite')}
                >
                  <FaHeart className="mr-2" />
                  Món yêu thích
                </button>
              </li>
            
              <li>
                <button
                  className="flex items-center text-gray-700 hover:text-red-600 w-full text-left hover:bg-gray-100 px-2 py-2 rounded"
                  onClick={() => navigate('/order-history')}
                >
                  <FaHistory className="mr-2" />
                  Lịch sử đặt món
                </button>
              </li>
            <li>
              <button
                onClick={() => {
                  alert("Đã đăng xuất!");
                  navigate('/login');
                }}
                className="flex items-center w-full text-left px-2 py-2 rounded hover:bg-gray-100 text-gray-700 hover:text-red-600"
              >
                <FaSignOutAlt className="mr-2" />
                Đăng xuất
              </button>
            </li>
          </ul>
        </div>

        {/* Main content: Đổi mật khẩu */}
        <div className="w-full md:w-2/3 border rounded-lg p-6 bg-white relative">
          <h2 className="text-red-600 font-bold text-xl mb-6">ĐỔI MẬT KHẨU</h2>
          <button
            onClick={handleCancel}
            className="absolute top-6 right-6 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-1 rounded text-sm"
          >
            Hủy
          </button>
          <div className="space-y-4 text-base">
            <div>
              <label className="font-semibold block mb-1">Mật khẩu cũ:</label>
              <input
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Mật khẩu mới:</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Xác nhận mật khẩu mới:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
