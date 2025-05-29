import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';
import { Link } from 'react-router-dom';


const Footer = () => {
  return (
    <footer className="bg-red-600 text-white px-6 md:px-16 pt-10 pb-6 font-kanit">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Cột 1: Thương hiệu & Liên hệ */}
        <div>
          <h2 className="text-xl font-extrabold mb-4">UNIFOODIE TAKEAWAY</h2>
          <h3 className="font-semibold mb-2">Liên hệ</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="w-5 h-5 mt-1" />
              <span>Khu phố 6, phường Linh Trung, TP. Thủ Đức, TP.HCM</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>0382868383</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <span>unifoodietakeaway@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Cột 2: Danh mục món ăn */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Danh mục món ăn</h3>
          <ul className="space-y-1">
            <li><Link to="/promotions" className="hover:underline">Ưu đãi nóng hổi</Link></li>
            <li><Link to="/404" className="hover:underline">Bữa sáng tiện lợi</Link></li>
            <li><Link to="/404" className="hover:underline">Bữa trưa dinh dưỡng</Link></li>
             <li><Link to="/404" className="hover:underline">UniFoodie Snack Bar</Link></li>
            <li><Link to="/404" className="hover:underline">Đồ uống tươi mát</Link></li>
          </ul>
        </div>

        {/* Cột 3: Về UniFoodie */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Về UniFoodie</h3>
          <ul className="space-y-1">
            <li><Link to="/about-us" className="hover:underline">Our story</Link></li>
            <li><Link to="/404" className="hover:underline">Đơn lớn - Giá hời</Link></li>
            <li><Link to="/404" className="hover:underline">Tuyển dụng</Link></li>
          </ul>
        </div>

        {/* Cột 4: Chính sách */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Chính sách</h3>
          <ul className="space-y-1">
            <li><Link to="/operational-policy" className="hover:underline">Chính sách hoạt động</Link></li>
            <li><Link to="/policies-and-regulations" className="hover:underline">Chính sách và quy định</Link></li>
            <li><Link to="/data-privacy-policy" className="hover:underline">Chính sách bảo mật thông tin</Link></li>
          </ul>
        </div>
      </div>

      <p className="text-center mt-8">&copy; 2025 UniFoodie Takeaway</p>
    </footer>
  );
};

export default Footer;
