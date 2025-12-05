import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";

import logo from "../assets/images/logo.png";
import "./TopNavbar.css";

const TopNavbar = ({ routes }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navbar di halaman login/register
 if (["/", "/login", "/register"].includes(location.pathname)) return null;

  const role = localStorage.getItem("role");

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const userName =
    user?.nama || user?.username || (role === "admin" ? "Admin" : "Pelanggan");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Navbar fixed="top" expand="lg" className="custom-navbar shadow-sm">
      <Container>

        {/* LOGO & BRAND */}
        <Navbar.Brand
          style={{ cursor: "pointer" }}
          onClick={() => navigate(role === "admin" ? "/admin/dashboard" : "/home")}
        >
          <div className="d-flex align-items-center">
            <img src={logo} alt="logo" className="nav-logo" />

            <div className="ms-2">
              <div className="fw-bold" style={{ fontSize: "18px" }}>
                Aurora Salon
              </div>
              <div className="small text-muted">Beauty & Care</div>
            </div>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto align-items-center">

            {/* Dynamic Nav Menu */}
            {routes?.map((route, idx) => (
              <Nav.Link key={idx} className="me-2">
                <Button
                  className={`nav-btn ${
                    location.pathname === route.path ? "active" : ""
                  }`}
                  onClick={() => navigate(route.path)}
                >
                  {route.name}
                </Button>
              </Nav.Link>
            ))}

            {/* User Greeting + Logout */}
            {role && (
              <>
                <span className="fw-semibold me-3">Hai, {userName}</span>
                <Button variant="danger" className="logout-btn" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
