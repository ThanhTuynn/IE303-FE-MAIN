import React, { useState } from 'react';
import { FaUser, FaLock, FaBell, FaSignOutAlt, FaHeart, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ChangeProfile = () => {
  const navigate = useNavigate();

  // Trạng thái form
  const [formData, setFormData] = useState({
    username: 'pu0406@',
    name: 'Võ Thị Phương Uyên',
    birthDate: '2004-06-04',
    gender: 'Nữ',
    email: 'phuonguyen6372@gmail.com',
    phone: '0382868383',
    address: 'KTX Khu A',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("Dữ liệu đã lưu:", formData);
    alert("Thông tin đã được lưu!");
    setTimeout(() => {
      navigate('/profile');
    }, 100); // để alert hiển thị xong
  };

  const handleCancel = () => {
    setTimeout(() => {
      navigate('/profile');
    }, 100);
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
          <h3 className="text-red-600 font-bold text-lg">{formData.name}</h3>
          <p className="text-black font-medium">{formData.username}</p>

          <ul className="mt-6 w-full space-y-3 text-left">
            <li className="flex items-center text-red-600 font-semibold cursor-pointer">
              <FaUser className="mr-2" />
              Thông tin cá nhân
            </li>
            <li className="flex items-center text-gray-700 hover:text-red-600 cursor-pointer">
              <FaLock className="mr-2" />
              Đổi mật khẩu
            </li>
            <li className="flex items-center text-gray-700 hover:text-red-600 cursor-pointer">
              <FaBell className="mr-2" />
              Thông báo
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
                  onClick={() => navigate('/favourite')}
                >
                  <FaHistory className="mr-2" />
                  Lịch sử đặt món
                </button>
              </li>
            <li className="flex items-center text-gray-700 hover:text-red-600 cursor-pointer">
              <FaSignOutAlt className="mr-2" />
              Đăng xuất
            </li>
          </ul>
        </div>

        {/* Main content editable */}
        <div className="w-full md:w-2/3 border rounded-lg p-6 relative bg-white">
          <h2 className="text-red-600 font-bold text-xl mb-6">CHỈNH SỬA THÔNG TIN</h2>
          <div className="space-y-4 text-base">
            {[
              { label: 'Tên đăng nhập', name: 'username', disabled: true },
              { label: 'Họ và tên', name: 'name' },
              { label: 'Ngày sinh', name: 'birthDate', type: 'date' },
              { label: 'Giới tính', name: 'gender' },
              { label: 'Email', name: 'email', type: 'email' },
              { label: 'Số điện thoại', name: 'phone', type: 'tel' },
              { label: 'Địa chỉ', name: 'address' },
            ].map(({ label, name, type = 'text', disabled = false }) => (
              <div key={name}>
                <label className="font-semibold block mb-1">{label}:</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  disabled={disabled}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeProfile;
