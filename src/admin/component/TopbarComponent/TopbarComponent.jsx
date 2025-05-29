import React from "react";
import { BellOutlined } from "@ant-design/icons";
import "./TopbarComponent.css";
import Avatar from "../../asset/AvatarUser.jpg"; // Đường dẫn đến hình ảnh avatar

const TopbarComponent = ({ title }) => {
  // Thông tin người dùng mặc định
  const user = {
    avatar: Avatar, // URL hình ảnh avatar mặc định
    name: "Ttynn", // Tên tài khoản mặc định
    role: "Quản trị viên", // Quyền mặc định
  };

  return (
    <div className="topbar-container">
      <h2 className="topbar-title">{title}</h2>
      <div className="topbar-actions">
        <BellOutlined className="topbar-icon" />
        <div className="user-info">
          <img src={user.avatar} alt="User Avatar" className="user-avatar" />
          <div className="user-details">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopbarComponent;
