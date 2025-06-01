import React, { useState, useEffect, useRef } from "react";
import { EyeOutlined, EyeInvisibleOutlined, CameraOutlined } from "@ant-design/icons";
import Topbar from "../../component/TopbarComponent/TopbarComponent";
import FooterComponent from "../../component/FooterComponent/FooterComponent";
import "./AccountInfoPage.scss";
import AvatarAccount from "../../asset/AvatarUser.jpg";
import axios from "axios";

const AccountInfo = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [accountInfo, setAccountInfo] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    profilePicture: "",
  });

  const [initialAccountInfo, setInitialAccountInfo] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = localStorage.getItem('userData');
        const jwtToken = localStorage.getItem('jwtToken');

        if (!storedUserData || !jwtToken) {
          setError('User not logged in. Please log in to view account information.');
          setLoading(false);
          return;
        }

        const currentUser = JSON.parse(storedUserData);
        const userId = currentUser.id || currentUser._id;

        if (!userId) {
          setError('User ID not found. Please log in again.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:8080/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${jwtToken}`
          }
        });

        const userData = response.data;
        setAccountInfo({
          username: userData.username || "",
          fullName: userData.fullName || "",
          email: userData.email || "",
          phone: userData.phoneNumber || "",
          password: userData.password || "",
          profilePicture: userData.profilePicture || "https://cdn-icons-png.flaticon.com/512/706/706830.png",
        });
        setInitialAccountInfo({
          username: userData.username || "",
          fullName: userData.fullName || "",
          email: userData.email || "",
          phone: userData.phoneNumber || "",
          password: userData.password || "",
          profilePicture: userData.profilePicture || "https://cdn-icons-png.flaticon.com/512/706/706830.png",
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const isChanged = initialAccountInfo && JSON.stringify(accountInfo) !== JSON.stringify(initialAccountInfo);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountInfo({ ...accountInfo, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const storedUserData = localStorage.getItem('userData');
      const jwtToken = localStorage.getItem('jwtToken');
      const currentUser = JSON.parse(storedUserData);
      const userId = currentUser.id || currentUser._id;

      const response = await axios.put(`http://localhost:8080/api/users/${userId}`, accountInfo, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });

      if (response.status === 200) {
        alert("Thông tin tài khoản đã được cập nhật!");
        setInitialAccountInfo({ ...accountInfo });
      }
    } catch (err) {
      console.error('Error updating user data:', err);
      alert("Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại sau!");
    }
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

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh!');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 5MB!');
      return;
    }

    try {
      setUploading(true);
      const storedUserData = localStorage.getItem('userData');
      const jwtToken = localStorage.getItem('jwtToken');
      const currentUser = JSON.parse(storedUserData);
      const userId = currentUser.id || currentUser._id;

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `http://localhost:8080/api/users/${userId}/profile-picture`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.profilePictureUrl) {
        setAccountInfo(prev => ({
          ...prev,
          profilePicture: response.data.profilePictureUrl
        }));
        setInitialAccountInfo(prev => ({
          ...prev,
          profilePicture: response.data.profilePictureUrl
        }));
        alert('Cập nhật ảnh đại diện thành công!');
      }
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      alert('Có lỗi xảy ra khi tải lên ảnh đại diện. Vui lòng thử lại!');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="accountinfo-container">
        <Topbar title="THÔNG TIN TÀI KHOẢN" />
        <div className="main-content">
          <div className="loading-message">Đang tải thông tin tài khoản...</div>
        </div>
        <FooterComponent />
      </div>
    );
  }

  if (error) {
    return (
      <div className="accountinfo-container">
        <Topbar title="THÔNG TIN TÀI KHOẢN" />
        <div className="main-content">
          <div className="error-message">{error}</div>
        </div>
        <FooterComponent />
      </div>
    );
  }

  return (
    <div className="accountinfo-container">
      <Topbar title="THÔNG TIN TÀI KHOẢN" />
      <div className="main-content">
        {/* Cột bên trái: Avatar */}
        <div className="left-column">
          <div className="account-info">
            <div className="header-background"></div>
            <div className="account-avatar" onClick={handleImageClick} style={{ cursor: 'pointer' }}>
              <img
                src={accountInfo.profilePicture}
                alt="Account Avatar"
                className="account-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://cdn-icons-png.flaticon.com/512/706/706830.png";
                }}
              />
              <div className="avatar-overlay">
                <CameraOutlined />
                <span>Thay đổi ảnh</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
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
