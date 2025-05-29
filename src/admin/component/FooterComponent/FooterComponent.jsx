import React from "react";
import "./FooterComponent.css"; // Create this CSS file for styling
import {
  FacebookFilled,
  InstagramOutlined,
  TikTokFilled,
} from "@ant-design/icons"; // Ant Design icons for Facebook and Instagram

const FooterComponent = () => {
  return (
    <div className="footer-container">
      <span className="footer-text">Copyright © 2025 UniFoodie Takeaway</span>
      <div className="social-icons">
        <FacebookFilled className="social-icon" />
        <InstagramOutlined className="social-icon" />
        <TikTokFilled className="social-icon" />
      </div>
    </div>
  );
};

export default FooterComponent;
