import React, { useState } from "react";
import { Form, FloatingLabel, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./LoginPage.css";
import Logo from "../../assets/images/Logo.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = (e) => {
    e.preventDefault();
    const { username, password } = form;

    if (!username) return toast.error("Username wajib diisi");
    if (!password) return toast.error("Password wajib diisi");

    // =========================================
    // 1. CEK ADMIN
    // =========================================
    if (username === "admin" && password === "admin123") {
      // Simpan data admin
      localStorage.setItem(
        "user",
        JSON.stringify({ username: "admin", role: "admin" })
      );
      localStorage.setItem("role", "admin");

      toast.success("Login Admin berhasil!");
      return navigate("/admin/dashboard");
    }

    // =========================================
    // 2. CEK PELANGGAN (LOCALSTORAGE)
    // =========================================
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const found = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!found) {
      return toast.error("Akun tidak ditemukan. Silakan daftar.");
    }

    localStorage.setItem("user", JSON.stringify(found));
    localStorage.setItem("role", "pelanggan");

    toast.success("Login berhasil!");
    navigate("/home");
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header">
          <img src={Logo} alt="Salon Logo" className="login-logo" />
          <h2 className="login-title">Aurora Salon</h2>
          <p className="login-subtitle">Beauty & Care</p>
        </div>

        <Form onSubmit={handleLogin}>
          <FloatingLabel label="Username" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="login-input"
            />
          </FloatingLabel>

          <FloatingLabel label="Password" className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="login-input"
            />
          </FloatingLabel>

          <Button type="submit" className="login-btn w-100 mb-3">
            Login
          </Button>

          <p className="login-register">
            Belum punya akun?
            <span className="login-link" onClick={() => navigate("/register")}>
              Daftar di sini
            </span>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
