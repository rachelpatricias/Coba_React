import React, { useState } from "react";
import { Form, FloatingLabel, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import "./LoginPage.css";
import Logo from "../../assets/images/Logo.png";

const API_BASE = "http://localhost:8000/api";

const LoginPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = form;
    let newErrors = {};

    // ---------------------------
    // VALIDASI INPUT
    // ---------------------------
    if (!email) newErrors.email = "Email wajib diisi";
    if (!password) newErrors.password = "Password wajib diisi";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Silakan periksa input Anda");
      return;
    }

    try {
      // ---------------------------
      // 1. COBA LOGIN ADMIN
      // ---------------------------
      let response = null;

      try {
        response = await axios.post(`${API_BASE}/admin/login`, {
          email,
          password,
        });
      } catch (err) {
        response = null;
      }

      // ---------------------------
      // 2. JIKA BUKAN ADMIN, COBA LOGIN PELANGGAN
      // ---------------------------
      if (!response) {
        response = await axios.post(`${API_BASE}/pelanggan/login`, {
          email,
          password,
        });
      }

      const data = response.data;

      // Simpan token + user + role
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);

      toast.success("Login berhasil!");

      // Redirect berdasarkan role
      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Email atau password salah"
      );
    }
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
          {/* EMAIL */}
          <FloatingLabel label="Email" className="mb-3">
            <Form.Control
              type="email"
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`login-input ${errors.email ? "is-invalid" : ""}`}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </FloatingLabel>

          {/* PASSWORD */}
          <FloatingLabel label="Password" className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`login-input ${errors.password ? "is-invalid" : ""}`}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
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
