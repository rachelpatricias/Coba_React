// src/layouts/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import TopNavbar from "../components/TopNavbar";
import DynamicPageTitle from "../components/DynamicPageTitle";

const AdminLayout = () => {
  return (
    <div className="mt-4 pt-5">
      <DynamicPageTitle />
      <TopNavbar /> {/* Tidak kirim routes */}
      <div className="container mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
