import React from 'react';
import { FaUser, FaLock, FaBell, FaSignOutAlt,  FaHeart, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      title: 'Món ăn đang được giao đến',
      content:
        'Đơn hàng của bạn đang được đội ngũ shipper siêu tốc của UniFoodie mang đến. Vui lòng chú ý điện thoại giúp UniFoodie nhé!!!!',
    },
    {
      id: 2,
      title: 'Bạn ơi chờ một chút nhé',
      content:
        'Nhà hàng đang chuẩn bị món thật nhanh cho bạn.',
    },
    {
      id: 3,
      title: 'Món ăn đang được giao đến',
      content:
        'Đơn hàng của bạn đang được đội ngũ shipper siêu tốc của UniFoodie mang đến. Vui lòng chú ý điện thoại giúp UniFoodie nhé!!!!',
    },
  ];

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
                onClick={() => navigate('/change-password')}
                className="flex items-center w-full text-left px-2 py-2 rounded hover:bg-gray-100 text-gray-700 hover:text-red-600"
              >
                <FaLock className="mr-2" />
                Đổi mật khẩu
              </button>
            </li>
            <li>
              <button
                className="flex items-center w-full text-left px-2 py-2 rounded text-red-600 font-semibold bg-gray-100"
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
                  alert('Đã đăng xuất!');
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

        {/* Main content: Thông báo */}
        <div className="w-full md:w-2/3 border rounded-lg p-6 bg-white">
          <h2 className="text-red-600 font-bold text-xl mb-6">THÔNG BÁO</h2>
          <div className="space-y-4">
            {notifications.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 rounded-md border bg-[#fef2f2]"
              >
                <img
                  src="https://res.cloudinary.com/dbr85jktp/image/upload/v1747653402/1827301_dlrvkx.png"
                  alt="icon"
                  className="w-14 h-14 object-contain"
                />
                <div className="flex flex-col">
                  <h4 className="font-bold text-sm md:text-base mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-700 leading-snug">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
