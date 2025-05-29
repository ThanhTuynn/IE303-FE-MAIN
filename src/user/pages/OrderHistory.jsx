import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaLock,
  FaBell,
  FaSignOutAlt,
  FaHeart,
  FaHistory,
} from 'react-icons/fa';

const orderedItems = [
  {
    name: 'Bánh mì thịt nướng',
    quantity: 2,
    price: '60.000đ',
    status: 'Đã giao',
    image:
      'https://res.cloudinary.com/dbr85jktp/image/upload/v1746406267/banhmithapcam_gzfrza.webp',
  },
  {
    name: 'Mì trộn thập cẩm',
    quantity: 1,
    price: '30.000đ',
    status: 'Đã giao',
    image:
      'https://res.cloudinary.com/dbr85jktp/image/upload/v1746406257/mi-tron-thap-cam_ubo558.jpg',
  },
  {
    name: 'Trà đào cam sả',
    quantity: 3,
    price: '75.000đ',
    status: 'Đã giao',
    image:
      'https://res.cloudinary.com/dbr85jktp/image/upload/v1746426034/tra-dao-cam-sa-1_1721446535_p9anyf.jpg',
  },
];

const statusColor = {
  'Đã giao': 'text-green-600',
  'Đang chuẩn bị': 'text-yellow-600',
  'Đang giao': 'text-blue-600',
};

const OrderHistory = () => {
  const navigate = useNavigate();

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
                className="flex items-center text-gray-700 hover:text-red-600 w-full text-left hover:bg-gray-100 px-2 py-2 rounded"
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
                className="flex items-center text-red-600 font-semibold w-full text-left hover:bg-gray-100 px-2 py-2 rounded"
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
        <div className="w-full md:w-2/3 border rounded-lg p-6 bg-white">
          <h2 className="text-red-600 font-bold text-xl mb-6">LỊCH SỬ ĐẶT MÓN</h2>

          {orderedItems.length === 0 ? (
            <p className="text-gray-600">Bạn chưa đặt món nào.</p>
          ) : (
            <div className="space-y-4">
              {orderedItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center border rounded-lg p-3 bg-gray-50 shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md mr-4"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{item.name}</h4>
                    <p className="text-gray-600">Số lượng: {item.quantity}</p>
                    <p className="text-red-600 font-bold">Tổng đơn: {item.price}</p>
                    <p className={`font-medium ${statusColor[item.status]}`}>
                      Trạng thái: {item.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
