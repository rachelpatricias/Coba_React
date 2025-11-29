// src/layouts/MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import TopNavbar from "../components/TopNavbar";
import DynamicPageTitle from "../components/DynamicPageTitle";

const routes = [
  { path: "/home", name: "Home" },
  { path: "/layanan", name: "Layanan" },
  { path: "/booking", name: "Booking" },
  { path: "/pesanan", name: "Pesanan" },
];

const MainLayout = () => {
  return (
    <div className="mt-4 pt-5">
      <DynamicPageTitle />
      <TopNavbar routes={routes} />
      <Outlet />
      <footer className="container d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
        <div className="col-md-4 d-flex align-items-center">
          <span className="mb-3 mb-md-0 text-body-secondary">© {new Date().getFullYear()} Aurora Salon</span>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
