import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FaUser, FaLock, FaBell, FaSignOutAlt, FaHeart, FaHistory } from 'react-icons/fa';

const PersonalInformation = () => {
  const navigate = useNavigate(); // ✅ hook điều hướng

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
      className="flex items-center text-red-600 font-semibold w-full text-left hover:bg-gray-100 px-2 py-2 rounded"
      onClick={() => navigate('/profile')}
    >
      <FaUser className="mr-2" />
      Thông tin cá nhân
    </button>
  </li>
  <li>
    <button
      className="flex items-center text-gray-700 hover:text-red-600 w-full text-left hover:bg-gray-100 px-2 py-2 rounded"
      onClick={() => navigate('/change-password')}
    >
      <FaLock className="mr-2" />
      Đổi mật khẩu
    </button>
  </li>
  <li>
    <button
      className="flex items-center text-gray-700 hover:text-red-600 w-full text-left hover:bg-gray-100 px-2 py-2 rounded"
      onClick={() => navigate('/notifications')}
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
      className="flex items-center text-gray-700 hover:text-red-600 w-full text-left hover:bg-gray-100 px-2 py-2 rounded"
      onClick={() => {
        // TODO: thực hiện đăng xuất tại đây
        alert('Đã đăng xuất!');
        navigate('/login');
      }}
    >
      <FaSignOutAlt className="mr-2" />
      Đăng xuất
    </button>
  </li>
</ul>

        </div>

        {/* Main content */}
        <div className="w-full md:w-2/3 border rounded-lg p-6 relative bg-white">
          <h2 className="text-red-600 font-bold text-xl mb-6">THÔNG TIN CÁ NHÂN</h2>
          <button
            onClick={() => navigate('/change-profile')}
            className="absolute top-6 right-6 text-blue-600 hover:underline text-sm"
          >
            Chỉnh sửa
          </button>
          <div className="space-y-3 text-base">
            <p><span className="font-semibold">Tên đăng nhập:</span> pu0406@</p>
            <p><span className="font-semibold">Họ và tên:</span> Võ Thị Phương Uyên</p>
            <p><span className="font-semibold">Ngày sinh:</span> 04/06/2004</p>
            <p><span className="font-semibold">Giới tính:</span> Nữ</p>
            <p><span className="font-semibold">Email:</span> phuonguyen6372@gmail.com</p>
            <p><span className="font-semibold">Số điện thoại:</span> 0382868383</p>
            <p><span className="font-semibold">Địa chỉ:</span> KTX Khu A</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
