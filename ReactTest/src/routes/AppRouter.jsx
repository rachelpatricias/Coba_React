// src/routes/AppRouter.jsx
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";

// layouts
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

// protected
import ProtectedAdmin from "./protected/ProtectedAdmin";
import ProtectedUser from "./protected/ProtectedUser";

// pelanggan pages
import LoginPage from "../pages/pelanggan/LoginPage";
import RegisterPage from "../pages/pelanggan/RegisterPage";
import LayananPage from "../pages/pelanggan/LayananPage";
import BookingPage from "../pages/pelanggan/BookingPage";
import PesananPage from "../pages/pelanggan/PesananPage";

// admin pages
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminLayananPage from "../pages/admin/AdminLayananPage";
import AdminPesananPage from "../pages/admin/AdminPesananPage";
import AdminJadwalPage from "../pages/admin/AdminJadwalPage";
import HomePage from "../pages/pelanggan/HomePage";

const router = createBrowserRouter([
  {
    path: "*",
    element: <div className="p-5">404 - Halaman Tidak Ditemukan</div>,
  },

  // ===== AUTH (TANPA LAYOUT) =====
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },

  // ===== PELANGGAN (DENGAN LAYOUT) =====
  {
    element: <MainLayout />,
    children: [
      { path: "/home", element: <ProtectedUser><HomePage /></ProtectedUser> },
      { path: "/layanan", element: <ProtectedUser><LayananPage /></ProtectedUser> },
      { path: "/booking", element: <ProtectedUser><BookingPage /></ProtectedUser> },
      { path: "/pesanan", element: <ProtectedUser><PesananPage /></ProtectedUser> },
    ],
  },

  // ===== ADMIN LOGIN (TANPA LAYOUT) =====
  { path: "/admin/login", element: <AdminLoginPage /> },

  // ===== ADMIN PROTECTED (DENGAN LAYOUT) =====
  {
    path: "/admin",
    element: (
      <ProtectedAdmin>
        <AdminLayout />
      </ProtectedAdmin>
    ),
    children: [
      { path: "dashboard", element: <AdminDashboardPage /> },
      { path: "layanan", element: <AdminLayananPage /> },
      { path: "pesanan", element: <AdminPesananPage /> },
      { path: "jadwal", element: <AdminJadwalPage /> },
    ],
  },
]);

const AppRouter = () => {
  return (
    <>
      <Toaster position="top-center" richColors />
      <RouterProvider router={router} />
    </>
  );
};

export default AppRouter;
