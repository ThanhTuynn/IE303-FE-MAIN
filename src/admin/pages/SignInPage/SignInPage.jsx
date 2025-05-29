import React, { useState } from "react";
import "./SignInPage.scss";
import HinhNen from "../../asset/HinhNen.png";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false); // Trạng thái hiển thị mật khẩu

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signin-container">
      <div className="signin-left">
        <img src={HinhNen} alt="Hình nền UniFoodie" className="signin-image" />
      </div>
      <div className="signin-right">
        <h2>ĐĂNG NHẬP</h2>
        <form className="signin-form">
          <div className="form-group">
            <label htmlFor="email">Địa chỉ email hoặc số điện thoại</label>
            <input
              type="text"
              id="email"
              placeholder="Nhập email hoặc số điện thoại"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"} // Hiển thị hoặc ẩn mật khẩu
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
          <div className="form-footer">
            <a href="/admin/forgot-password" className="forgot-password">
              Quên mật khẩu
            </a>
          </div>
          <button type="submit" className="signin-button">
            Đăng nhập
          </button>
        </form>
        <p className="signup-link">
          Bạn chưa có tài khoản? <a href="/admin/sign-up">Đăng ký</a>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
