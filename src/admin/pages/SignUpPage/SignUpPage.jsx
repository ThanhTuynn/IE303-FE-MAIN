import React, { useState } from "react";
import "./SignUpPage.scss";
import HinhNen from "../../asset/HinhNen.png";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false); // Trạng thái hiển thị mật khẩu

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <img src={HinhNen} alt="Hình nền UniFoodie" className="signup-image" />
      </div>
      <div className="signup-right">
        <h2>ĐĂNG KÝ</h2>
        <form className="signup-form">
          <div className="form-group">
            <label htmlFor="name-signup">Tên đăng nhập</label>
            <input type="text" id="name-signup" placeholder="Nhập tên đăng nhập" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Họ và tên</label>
            <input type="text" id="email" placeholder="Nhập địa chỉ email" />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input type="text" id="phone" placeholder="Nhập số điện thoại" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"} 
                id="password"
                placeholder="Nhập mật khẩu"
              />
              <span
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "confirm-password"} 
                id="confirm-password"
                placeholder="Nhập xác nhận mật khẩu"
              />
              <span
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </span>
            </div>
          </div>
          <button type="submit" className="signup-button">
            Đăng ký
          </button>
        </form>
        <p className="signin-link">
          Bạn đã có tài khoản? <a href="/admin/sign-in">Đăng nhập</a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
