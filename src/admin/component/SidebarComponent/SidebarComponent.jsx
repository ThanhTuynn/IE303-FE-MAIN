import React from "react";
import {
  DashboardOutlined,
  WechatWorkOutlined,
  CoffeeOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../asset/logoUniFoodie.png";
import "./SidebarComponent.css";

const SidebarComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  return (
    <div className="sidebarcomponent">
      <div className="logo">
        <img src={logo} alt="UniFoodie Logo" />
      </div>
      <div className="wrapInfo">
        <ul className="mainBar">
          <li className="menu-item">
            <Link
              to="/admin"
              className={`${isActive("/admin") ? "active" : ""}`}
            >
              <DashboardOutlined className="icon" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="menu-item">
            <Link
              to="/admin/chatting"
              className={`${isActive("/admin/chatting") ? "active" : ""}`}
            >
              <WechatWorkOutlined className="icon" />
              <span>Trò chuyện</span>
            </Link>
          </li>
          <li className="menu-item">
            <Link
              to="/admin/list-order-product"
              className={`${
                isActive("/admin/list-order-product") ? "active" : ""
              }`}
            >
              <ShoppingCartOutlined className="icon" />
              <span>Đơn hàng</span>
            </Link>
          </li>
          <li className="menu-item">
            <Link
              to="/admin/food-management"
              className={`${
                isActive("/admin/food-management") ? "active" : ""
              }`}
            >
              <CoffeeOutlined className="icon" />
              <span>Quản lý món ăn</span>
            </Link>
          </li>
          <li className="menu-item">
            <Link
              to="/admin/promotion-management"
              className={`${
                isActive("/admin/promotion-management") ? "active" : ""
              }`}
            >
              <DollarOutlined className="icon" />
              <span>Quản lý khuyến mãi</span>
            </Link>
          </li>
          <li className="menu-item">
            <Link
              to="/admin/store-info"
              className={`${isActive("/admin/store-info") ? "active" : ""}`}
            >
              <ShopOutlined className="icon" />
              <span>Thông tin cửa hàng</span>
            </Link>
          </li>
          <li className="menu-item">
            <Link
              to="/admin/account-info"
              className={`${isActive("/admin/account-info") ? "active" : ""}`}
            >
              <UserOutlined className="icon" />
              <span>Thông tin tài khoản</span>
            </Link>
          </li>
        </ul>
        <ul className="subBar">
          <li className="menu-item">
            <button
              onClick={handleLogout}
              className="logout-button"
            >
              <LogoutOutlined className="icon" />
              <span>Đăng xuất</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarComponent;
