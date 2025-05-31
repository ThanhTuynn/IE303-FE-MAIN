import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserApp from "./user/AppUser.jsx";
import AdminApp from "./admin/AppAdmin.jsx";
import ProtectedRoute from "./user/components/ProtectedRoute.jsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin/*"
          element={<ProtectedRoute element={AdminApp} requiredRole="admin" />}
        />
        <Route path="/*" element={<UserApp />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
