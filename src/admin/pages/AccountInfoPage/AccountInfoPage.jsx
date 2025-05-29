import React, { useState } from "react";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import Topbar from "../../component/TopbarComponent/TopbarComponent";
import FooterComponent from "../../component/FooterComponent/FooterComponent";
import "./AccountInfoPage.scss";
import AvatarAccount from "../../asset/AvatarUser.jpg";

const AccountInfo = () => {
  const [accountInfo, setAccountInfo] = useState({
    username: "Tynn",
    fullName: "Nguyễn Ngọc Thanh Tuyền",
    email: "thanhtuyen.ntt@gmail.com",
    phone: "031 354 0401",
    password: "Tuyen@0112",
  });

  const [initialAccountInfo] = useState({
    username: "Tynn",
    fullName: "Nguyễn Ngọc Thanh Tuyền",
    email: "thanhtuyen.ntt@gmail.com",
    phone: "031 354 0401",
    password: "Tuyen@0112",
  });

  const isChanged =
    JSON.stringify(accountInfo) !== JSON.stringify(initialAccountInfo);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountInfo({ ...accountInfo, [name]: value });
  };

  const handleUpdate = () => {
    alert("Thông tin tài khoản đã được cập nhật!");
  };

  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleChangePassword = () => {
    setIsChangePasswordVisible(true);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSavePassword = () => {
    const { currentPassword, newPassword, confirmNewPassword } = passwords;

    // Kiểm tra nếu có trường nào bị bỏ trống
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert("Vui lòng điền đầy đủ tất cả các trường!");
      return;
    }

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu mới có khớp không
    if (newPassword !== confirmNewPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    // Kiểm tra mật khẩu hiện tại có đúng với mật khẩu ban đầu không
    if (currentPassword !== accountInfo.password) {
      alert("Mật khẩu hiện tại không đúng!");
      return;
    }

    // Cập nhật mật khẩu thành công
    alert("Mật khẩu đã được thay đổi thành công!");
    setIsChangePasswordVisible(false);
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });

    // Cập nhật mật khẩu mới vào accountInfo
    setAccountInfo({ ...accountInfo, password: newPassword });
  };

  const handleCancelPasswordChange = () => {
    setIsChangePasswordVisible(false);
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  };

  return (
    <div className="accountinfo-container">
      <Topbar title="THÔNG TIN TÀI KHOẢN" />
      <div className="main-content">
        {/* Cột bên trái: Avatar */}
        <div className="left-column">
          <div className="account-info">
            <div className="header-background"></div>
            <div className="account-avatar">
              <img
                src={AvatarAccount}
                alt="Account Avatar"
                className="account-image"
              />
            </div>
          </div>
        </div>

        {/* Cột bên phải: Form thông tin tài khoản */}
        <div className="right-column">
          <form className="account-form">
            <div className="form-group">
              <label>Tên đăng nhập</label>
              <input
                type="text"
                name="username"
                value={accountInfo.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={accountInfo.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={accountInfo.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={accountInfo.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="change-password-button"
                onClick={handleChangePassword}
              >
                Đổi mật khẩu
              </button>
              <button
                type="button"
                className={`update-button ${isChanged ? "active" : "disabled"}`}
                onClick={isChanged ? handleUpdate : null}
                disabled={!isChanged}
              >
                Cập nhật
              </button>
            </div>
          </form>

          {/* Modal đổi mật khẩu */}
          {isChangePasswordVisible && (
            <div className="change-password-modal">
              <div className="modal-content">
                <h3 style={{ color: "#cc1b1b", fontWeight: "bold" }}>
                  Đổi mật khẩu
                </h3>
                <div className="form-group">
                  <label>Mật khẩu hiện tại</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPasswords.currentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={passwords.currentPassword}
                      onChange={handlePasswordChange}
                    />
                    <span
                      className="toggle-password"
                      onClick={() =>
                        togglePasswordVisibility("currentPassword")
                      }
                    >
                      {showPasswords.currentPassword ? (
                        <EyeInvisibleOutlined />
                      ) : (
                        <EyeOutlined />
                      )}
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Mật khẩu mới</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPasswords.newPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                    />
                    <span
                      className="toggle-password"
                      onClick={() => togglePasswordVisibility("newPassword")}
                    >
                      {showPasswords.newPassword ? (
                        <EyeInvisibleOutlined />
                      ) : (
                        <EyeOutlined />
                      )}
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Xác nhận mật khẩu mới</label>
                  <div className="password-input-wrapper">
                    <input
                      type={
                        showPasswords.confirmNewPassword ? "text" : "password"
                      }
                      name="confirmNewPassword"
                      value={passwords.confirmNewPassword}
                      onChange={handlePasswordChange}
                    />
                    <span
                      className="toggle-password"
                      onClick={() =>
                        togglePasswordVisibility("confirmNewPassword")
                      }
                    >
                      {showPasswords.confirmNewPassword ? (
                        <EyeInvisibleOutlined />
                      ) : (
                        <EyeOutlined />
                      )}
                    </span>
                  </div>
                </div>
                <div className="modal-actions">
                  <button onClick={handleCancelPasswordChange}>Hủy</button>
                  <button onClick={handleSavePassword}>Lưu</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default AccountInfo;
