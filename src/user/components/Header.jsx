import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, User, ShoppingBag, Phone, Heart } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

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

        <div className="flex space-x-4">
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

          <Link to="/profile">
            <User
              className={`h-6 w-6 cursor-pointer transition-colors duration-200 ${
                isActive('/profile') ? 'text-red-600' : 'text-black'
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
