import React, { useState } from "react";
import "./ForgetPassword.scss";
import HinhNen from "../../asset/HinhNen.png";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false); // Trạng thái hiển thị mật khẩu

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="forgetpassword-container">
      <div className="forgetpassword-left">
        <img
          src={HinhNen}
          alt="Hình nền UniFoodie"
          className="forgetpassword-image"
        />
      </div>
      <div className="forgetpassword-right">
        <h2>QUÊN MẬT KHẨU</h2>
        <form className="forgetpassword-form">
          <div className="form-group">
            <label htmlFor="password-now">Mật khẩu hiện tại</label>
            <div className="password">
              <input
                type={showPassword ? "text" : "password-now"}
                id="password-now"
                placeholder="Nhập mật khẩu hiện tại"
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
            <label htmlFor="password-new">Mật khẩu mới</label>
            <div className="password">
              <input
                type={showPassword ? "text" : "password-new"}
                id="password-new"
                placeholder="Nhập mật khẩu mới"
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
            <div className="password">
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
          <button type="submit" className="change-button">
            Đặt lại mật khẩu
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
