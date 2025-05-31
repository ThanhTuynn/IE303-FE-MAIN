import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaBell, FaSignOutAlt,  FaHeart, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Notifications = () => {
  const navigate = useNavigate();

  // States for notifications
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [errorNotifications, setErrorNotifications] = useState(null);

  // States for user info in sidebar
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const userData = localStorage.getItem('userData');

    if (!token || !userData) {
      alert("Please log in to view your notifications.");
      navigate('/login');
      return;
    }

    let currentUser = null;
    try {
        currentUser = JSON.parse(userData);
        // Fetch user info for sidebar
        const fetchUser = async (id, authToken) => {
            try {
                setLoadingUser(true);
                const userResponse = await axios.get(`http://localhost:8080/api/users/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                setUser(userResponse.data);
                setLoadingUser(false);
            } catch (err) {
                 console.error('Error fetching user data:', err);
                 setErrorUser('Failed to load user info.');
                 setLoadingUser(false);
            }
        };
        fetchUser(currentUser.id || currentUser._id, token);

        // Fetch notifications
        const fetchNotifications = async (id, authToken) => {
            try {
                setLoadingNotifications(true);
                const notificationsResponse = await axios.get(`http://localhost:8080/api/notifications/user/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                setNotifications(notificationsResponse.data);
                setLoadingNotifications(false);
            } catch (err) {
                console.error('Error fetching notifications:', err);
                 setErrorNotifications('Failed to load notifications.');
                 setLoadingNotifications(false);
            }
        };
        fetchNotifications(currentUser.id || currentUser._id, token);


    } catch (e) {
        console.error("Failed to parse user data from localStorage:", e);
         alert("Error retrieving user data. Please log in again.");
         navigate('/login');
         // Set error for both sections since we can't get userId
         setErrorUser('Error retrieving user data.');
         setErrorNotifications('Error retrieving user data.');
         setLoadingUser(false);
         setLoadingNotifications(false);
         return;
    }

  }, [navigate]);


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
          {loadingUser && <p>Loading user info...</p>}
          {errorUser && <p className="text-red-600">{errorUser}</p>}
          {user && (
              <>
                <h3 className="text-red-600 font-bold text-lg">{user.fullName || user.username || 'User'}</h3>
                <p className="text-black font-medium">{user.username || user.email || 'N/A'}</p>
              </>
          )}

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
          {/* {loadingNotifications && <p>Loading notifications...</p>} */}
          {errorNotifications && <p className="text-red-600">{errorNotifications}</p>}
          {!loadingNotifications && !errorNotifications && notifications.length === 0 && (
               <p className="text-gray-600">Bạn không có thông báo nào.</p>
          )}
          {!loadingNotifications && !errorNotifications && notifications.length > 0 && (
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
                  <p className="text-sm text-gray-700 leading-snug">{item.message}</p>
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

export default Notifications;
