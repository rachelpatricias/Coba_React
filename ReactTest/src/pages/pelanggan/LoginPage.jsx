import React, { useState } from "react";
import { Container, Form, FloatingLabel, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = (e) => {
    e.preventDefault();
    const { username, password } = form;

    if (!username || !password) return toast.error("Isi username & password");

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // cek username & password sesuai data registrasi
    const found = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!found) {
      return toast.error(
        "Akun tidak ditemukan! Silakan register terlebih dahulu."
      );
    }

    localStorage.setItem("user", JSON.stringify(found));
    localStorage.setItem("role", "pelanggan");
    toast.success("Login berhasil!");

    navigate("/layanan");
  };

  return (
    <Container className="mt-5 col-md-6">
      <h2 className="mb-4 text-center">Login Pelanggan</h2>
      <Form onSubmit={handleLogin}>
        <FloatingLabel label="Username" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
          />
        </FloatingLabel>

        <FloatingLabel label="Password" className="mb-3">
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </FloatingLabel>

        <Button type="submit" className="w-100 mb-3">
          Login
        </Button>

        <p className="text-center">
          Belum punya akun?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Daftar di sini
          </span>
        </p>
      </Form>
    </Container>
  );
};

export default LoginPage;