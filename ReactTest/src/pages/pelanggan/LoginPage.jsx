import React, { useState } from "react";
import { Form, FloatingLabel, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./LoginPage.css";
import Logo from "../../assets/images/Logo.png";

const LoginPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  // ============================
  // REAL-TIME VALIDATION
  // ============================
  const validateField = (name, value) => {
    let msg = "";

    if (name === "username") {
      if (!value.trim()) msg = "Username wajib diisi.";
      else if (value.length < 3) msg = "Username minimal 3 karakter.";
    }

    if (name === "password") {
      if (!value.trim()) msg = "Password wajib diisi.";
      else if (value.length < 6) msg = "Password minimal 6 karakter.";
    }

    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  // ============================
  // VALIDASI SAAT SUBMIT (satu-per-satu)
  // ============================
  const handleLogin = (e) => {
    e.preventDefault();

    // Cek username dulu
    if (!form.username.trim()) {
      return toast.error("Username wajib diisi!");
    }
    if (errors.username) {
      return toast.error(errors.username);
    }

    // Baru cek password
    if (!form.password.trim()) {
      return toast.error("Password wajib diisi!");
    }
    if (errors.password) {
      return toast.error(errors.password);
    }

    // Ambil user dari localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const found = users.find(
      (u) => u.username === form.username && u.password === form.password
    );

    if (!found) {
      return toast.error("Akun tidak ditemukan! Silakan register dulu.");
    }

    // Login success
    localStorage.setItem("user", JSON.stringify(found));
    localStorage.setItem("role", "pelanggan");

    toast.success("Login berhasil!");
    navigate("/layanan");
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
          
          {/* USERNAME */}
          <FloatingLabel label="Username" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              className={errors.username ? "is-invalid login-input" : "login-input"}
            />
            {errors.username && <div className="error-text">{errors.username}</div>}
          </FloatingLabel>

          {/* PASSWORD */}
          <FloatingLabel label="Password" className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={errors.password ? "is-invalid login-input" : "login-input"}
            />
            {errors.password && <div className="error-text">{errors.password}</div>}
          </FloatingLabel>

          <Button type="submit" className="login-btn w-100 mb-3">
            Login
          </Button>

          <p className="login-register">
            Belum punya akun?{" "}
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
