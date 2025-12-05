// src/layouts/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import TopNavbar from "../components/TopNavbar";
import DynamicPageTitle from "../components/DynamicPageTitle";

const adminRoutes = [
  { path: "/admin/dashboard", name: "Dashboard" },
  { path: "/admin/layanan", name: "Layanan" },
  { path: "/admin/pegawai", name: "Pegawai" }, 
  { path: "/admin/pesanan", name: "Pesanan" },
];

const AdminLayout = () => {
  return (
    <div className="mt-4 pt-5">
      <DynamicPageTitle />
      <TopNavbar routes={adminRoutes} />
      <div className="container mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
