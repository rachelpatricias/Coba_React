import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Protected Routes
import ProtectedAdmin from "./protected/ProtectedAdmin";
import ProtectedUser from "./protected/ProtectedUser";

// Navbar
import TopNavbar from "../components/TopNavbar";

// ADMIN PAGES
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminLayananPage from "../pages/admin/AdminLayananPage";
import AdminPegawaiPage from "../pages/admin/AdminPegawaiPage";
import AdminPesananPage from "../pages/admin/AdminPesananPage";

// USER PAGES
import LoginPage from "../pages/pelanggan/LoginPage";
import RegisterPage from "../pages/pelanggan/RegisterPage";
import HomePage from "../pages/pelanggan/HomePage";
import LayananPage from "../pages/pelanggan/LayananPage";
import BookingPage from "../pages/pelanggan/BookingPage";
import PesananPage from "../pages/pelanggan/PesananPage";
import PembayaranPage from "../pages/pelanggan/PembayaranPage";

function LayoutRouter() {
  const location = useLocation();
  const role = localStorage.getItem("role");

  const customerRoutes = [
    { name: "Home", path: "/home" },
    { name: "Layanan", path: "/layanan" },
    { name: "Pesanan", path: "/pesanan" },
    { name: "Booking", path: "/booking" },
  ];

  const adminRoutes = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Layanan", path: "/admin/layanan" },
    { name: "Pegawai", path: "/admin/pegawai" },
    { name: "Pesanan", path: "/admin/pesanan" },
  ];

  const navRoutes = role === "admin" ? adminRoutes : customerRoutes;

  const hideNavbar = ["/", "/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <TopNavbar routes={navRoutes} />}

      <div style={{ paddingTop: hideNavbar ? 0 : 100 }}>
        <Routes>

          {/* AUTH */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* USER ROUTES */}
          <Route path="/home" element={<ProtectedUser><HomePage /></ProtectedUser>} />
          <Route path="/layanan" element={<ProtectedUser><LayananPage /></ProtectedUser>} />
          <Route path="/booking" element={<ProtectedUser><BookingPage /></ProtectedUser>} />
          <Route path="/pesanan" element={<ProtectedUser><PesananPage /></ProtectedUser>} />
          <Route path="/pembayaran" element={<ProtectedUser><PembayaranPage /></ProtectedUser>} />

          {/* ADMIN ROUTES */}
          <Route path="/admin/dashboard" element={<ProtectedAdmin><AdminDashboardPage /></ProtectedAdmin>} />
          <Route path="/admin/layanan" element={<ProtectedAdmin><AdminLayananPage /></ProtectedAdmin>} />
          <Route path="/admin/pegawai" element={<ProtectedAdmin><AdminPegawaiPage /></ProtectedAdmin>} />
          <Route path="/admin/pesanan" element={<ProtectedAdmin><AdminPesananPage /></ProtectedAdmin>} />

          {/* DEFAULT */}
          <Route path="*" element={<LoginPage />} />

        </Routes>
      </div>
    </>
  );
}

export default function AppRouter() {
  return (
    <Router>
      <LayoutRouter />
    </Router>
  );
}
