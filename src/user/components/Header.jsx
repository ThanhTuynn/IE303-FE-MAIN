import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, User, ShoppingBag, Phone, Heart } from 'lucide-react';
import { FaUserCircle } from 'react-icons/fa';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userData, setUserData] = useState(null);
  const profileDropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    // Check for the presence of the JWT token and user data in localStorage
    const token = localStorage.getItem('jwtToken');
    const storedUserData = localStorage.getItem('userData');

    setIsLoggedIn(!!token && !!storedUserData);

    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
        setUserData(null); // Clear potentially invalid data
        setIsLoggedIn(false); // Assume not logged in if data is corrupt
      }
    }

    // Add event listener to close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Clean up the event listener
      document.removeEventListener('mousedown', handleClickOutside);
    };

  }, []); // Run this effect once on mount

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleProfileClick = () => {
    // Toggle dropdown visibility instead of navigating directly
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userData');
    // Update state
    setIsLoggedIn(false);
    setUserData(null);
    setShowProfileDropdown(false);
    // Redirect to home or login page
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <header className="w-full font-kanit sticky top-0 z-50 bg-white">
      {/* Main Header */}
      <div className="bg-white py-2 px-4 md:px-6 lg:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="https://res.cloudinary.com/dbr85jktp/image/upload/v1747726195/Blue_White_Bold_Playful_Kids_Clothing_Logo_1000_x_500_px_2_g7qika.png" 
            alt="Logo" 
            className="h-24 w-auto mr-2" 
          />
        </Link>

        <nav className="hidden md:flex space-x-8 flex-1 justify-center">
          <Link
            to="/"
            className={`text-2xl font-semibold hover:text-red-600 ${
              isActive('/') ? 'text-red-600 border-b-2 border-red-600' : 'text-black'
            }`}
          >
            TRANG CHỦ
          </Link>

          <Link
            to="/menu"
            className={`text-2xl font-semibold hover:text-red-600 ${
              isActive('/menu') ? 'text-red-600 border-b-2 border-red-600' : 'text-black'
            }`}
          >
            THỰC ĐƠN
          </Link>

          <Link
            to="/promotions"
            className={`text-2xl font-semibold hover:text-red-600 ${
              isActive('/promotions') ? 'text-red-600 border-b-2 border-red-600' : 'text-black'
            }`}
          >
            KHUYẾN MÃI
          </Link>

          <Link
            to="/about-us"
            className={`text-2xl font-semibold hover:text-red-600 ${
              isActive('/about-us') ? 'text-red-600 border-b-2 border-red-600' : 'text-black'
            }`}
          >
            VỀ CHÚNG TÔI
          </Link>
        </nav>

        <div className="flex space-x-4 items-center">
          <Link to="/favourite">
            <Heart
              className={`h-6 w-6 cursor-pointer transition-colors duration-200 ${
                isActive('/favourite') ? 'text-red-600' : 'text-black'
              }`}
            />
          </Link>

          <Link to="/notifications">
            <Bell
              className={`h-6 w-6 cursor-pointer transition-colors duration-200 ${
                isActive('/notifications') ? 'text-red-600' : 'text-black'
              }`}
            />
          </Link>

          <Link to="/cart">
            <ShoppingBag
              className={`h-6 w-6 cursor-pointer transition-colors duration-200 ${
                isActive('/cart') ? 'text-red-600' : 'text-black'
              }`}
            />
          </Link>

          {/* Profile/Login Section */}
          <div className="relative" ref={profileDropdownRef}>
            {isLoggedIn ? (
              // If logged in, show profile icon/link and dropdown
              <>
                <button
                  onClick={handleProfileClick}
                  className="flex items-center text-gray-700 hover:text-red-600 focus:outline-none"
                >
                  <FaUserCircle className="text-2xl mr-1" /> {/* Profile Icon */}
                  <span className="hidden md:inline">Hồ sơ</span> {/* Show text on medium screens and up*/}
                </button>

                {showProfileDropdown && userData && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        {/* Display basic user info from localStorage */}
                        <p className="font-semibold">{userData.name || userData.username || 'Người dùng'}</p>
                        <p className="text-xs text-gray-500">{userData.email || 'N/A'}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowProfileDropdown(false)} // Close dropdown on click
                      >
                        Thông tin cá nhân
                      </Link>
                       <Link
                        to="/order-history"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                         onClick={() => setShowProfileDropdown(false)} // Close dropdown on click
                      >
                        Lịch sử đặt món
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // If not logged in, show Login button
              <button
                onClick={handleLoginClick}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Đăng nhập
              </button>
            )}
          </div>


        </div>
      </div>

      {/* Hotline */}
      <div className="bg-black text-white py-2 px-4 flex justify-center">
        <div className="bg-red-600 rounded-full py-1 px-6 flex items-center">
          <Phone className="h-4 w-4 mr-2 text-white" />
          <span className="font-medium">Hotline: 0382868383</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
