import React from "react";
import App from "./router"; // nếu router chứa toàn bộ UI người dùng

const AppUser = () => {
  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

export default AppUser;
