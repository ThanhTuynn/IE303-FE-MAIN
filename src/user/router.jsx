import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Homepage from "./pages/Homepage";
import Menu from "./pages/Menu";
import Promotions from "./pages/Promotions";
import Bestsellers from "./pages/Bestsellers";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import AboutUs from "./pages/AboutUs";
import OperationalPolicy from "./pages/OperationalPolicy";
import PoliciesAndRegulations from "./pages/PoliciesAndRegulations";
import DataPrivacyPolicy from "./pages/DataPrivacyPolicy";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Payment from "./pages/Payment";
import ChangeProfile from "./pages/ChangeProfile";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import ChangePassword from "./pages/ChangePassword";
import Favourite from "./pages/Favourite";
import OrderHistory from "./pages/OrderHistory";
import QRPayment from "./pages/QRPayment";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="menu" element={<Menu />} />
          <Route path="promotions" element={<Promotions />} />
          <Route path="bestsellers" element={<Bestsellers />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="operational-policy" element={<OperationalPolicy />} />
          <Route
            path="policies-and-regulations"
            element={<PoliciesAndRegulations />}
          />
          <Route path="data-privacy-policy" element={<DataPrivacyPolicy />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="payment" element={<Payment />} />
          <Route path="change-profile" element={<ChangeProfile />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="favourite" element={<Favourite />} />
          <Route path="*" element={<NotFound />} />
          <Route path="order-history" element={<OrderHistory />} />
          <Route path="qr-payment" element={<QRPayment />} />
          {/* Add more routes as needed */}
        </Route>
      </Routes>
    </>
  );
};

export default App;
