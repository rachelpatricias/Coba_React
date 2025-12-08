import React, { useState } from "react";
import { Form, FloatingLabel, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "../../axiosConfig";
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

    // ================================
    // VALIDASI INPUT
    // ================================
    if (!email) newErrors.email = "Email wajib diisi";
    if (!password) newErrors.password = "Password wajib diisi";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Silakan periksa input Anda");
      return;
    }

    try {
      // ================================
      // 1. COBA LOGIN ADMIN
      // ================================
      try {
        const resAdmin = await axios.post(`${API_BASE}/admin/login`, {
          email: email.toLowerCase(),
          password,
        });

        // Jika login admin berhasil
        localStorage.setItem("role", "admin");
        localStorage.setItem("token", resAdmin.data.token);
        localStorage.setItem("user", JSON.stringify(resAdmin.data.data));

        axios.defaults.headers.common["Authorization"] =
          `Bearer ${resAdmin.data.token}`;

        toast.success("Login admin berhasil!");
        return navigate("/admin/dashboard");

      } catch (errAdmin) {
        // Jika admin gagal tetapi bukan error 404/401 → stop
        if (errAdmin.response?.status >= 500) {
          toast.error("Terjadi kesalahan server.");
          return;
        }
      }

      // ================================
      // 2. LOGIN PELANGGAN
      // ================================
      const resUser = await axios.post(`${API_BASE}/pelanggan/login`, {
        email: email.toLowerCase(),
        password,
      });

      localStorage.setItem("role", "pelanggan");
      localStorage.setItem("token", resUser.data.token);
      localStorage.setItem("user", JSON.stringify(resUser.data.data));

      axios.defaults.headers.common["Authorization"] =
        `Bearer ${resUser.data.token}`;

      toast.success("Login berhasil!");
      return navigate("/home");

    } catch (errUser) {
      const msg = errUser.response?.data?.message;

      console.log("ERROR LOGIN:", msg);

      if (!msg) {
        toast.error("Terjadi kesalahan server.");
        return;
      }

      if (msg?.toLowerCase().trim().includes("email tidak ditemukan")) {
        toast.error("Email tidak terdaftar. Silakan daftar dulu.");
        return;
      }

      if (msg?.toLowerCase().trim().includes("password salah")) {
        toast.error("Password salah.");
        return;
      }

      toast.error(msg);
    }
  };

  // ================================
  // RENDER UI
  // ================================
  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header">
          <img src={Logo} alt="Salon Logo" className="login-logo" />
          <h2 className="login-title">Aurora Salon</h2>
          <p className="login-subtitle">Beauty & Care</p>
        </div>

        <Form onSubmit={handleLogin}>
          {/* EMAIL INPUT */}
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

          {/* PASSWORD INPUT */}
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
            <span
              className="login-link"
              onClick={() => navigate("/register")}
            >
              Daftar di sini
            </span>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
