import React, { useState } from "react";
import { Form, FloatingLabel, Button } from "react-bootstrap";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RegisterPage.css";

const API_BASE = "http://localhost:8000/api";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama: "",
    email: "",
    nomor: "",
    alamat: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // HANDLE INPUT + VALIDASI REALTIME
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  // VALIDASI PER FIELD
  const validateField = (field, value) => {
    let message = "";

    switch (field) {
      case "nama":
        if (!value.trim()) message = "Nama wajib diisi.";
        else if (value.length < 3) message = "Nama minimal 3 karakter.";
        break;

      case "email":
        if (!value.trim()) message = "Email wajib diisi.";
        else if (!/\S+@\S+\.\S+/.test(value))
          message = "Format email tidak valid.";
        break;

      case "nomor":
        if (!value.trim()) message = "Nomor HP wajib diisi.";
        else if (!/^[0-9]+$/.test(value)) message = "Nomor HP hanya angka.";
        else if (value.length < 10)
          message = "Nomor HP minimal 10 digit.";
        break;

      case "alamat":
        if (!value.trim()) message = "Alamat wajib diisi.";
        break;

      case "password":
        if (!value.trim()) message = "Password wajib diisi.";
        else if (value.length < 6)
          message = "Password minimal 6 karakter.";
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  // VALIDASI KESELURUHAN SAAT SUBMIT
  const validateForm = () => {
    const finalErrors = {};

    Object.keys(form).forEach((field) => {
      validateField(field, form[field]);

      if (!form[field] || errors[field]) {
        finalErrors[field] = errors[field] || "Harus diisi.";
      }
    });

    return finalErrors;
  };

  // SUBMIT REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    const finalErrors = validateForm();

    if (Object.values(finalErrors).some((msg) => msg && msg !== "")) {
      toast.error("Periksa kembali data Anda");
      setErrors(finalErrors);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/pelanggan/register`, {
        nama: form.nama,
        email: form.email.toLowerCase(),
        no_hp: form.nomor,
        alamat: form.alamat,
        password: form.password,
      });

      toast.success("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Gagal melakukan registrasi"
      );
    }
  };

  return (
  <div className="register-bg">
    <div className="register-card">
      <h2 className="text-center mb-4 register-title">Daftar Pelanggan</h2>

      <Form onSubmit={handleRegister}>
        
        {/* NAMA */}
        <FloatingLabel label="Nama Lengkap" className="mb-3">
          <Form.Control
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            className={errors.nama ? "is-invalid register-input" : "register-input"}
          />
          {errors.nama && <div className="error-text">{errors.nama}</div>}
        </FloatingLabel>

        {/* EMAIL */}
        <FloatingLabel label="Email" className="mb-3">
          <Form.Control
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? "is-invalid register-input" : "register-input"}
          />
          {errors.email && <div className="error-text">{errors.email}</div>}
        </FloatingLabel>

        {/* NOMOR HP */}
        <FloatingLabel label="Nomor HP" className="mb-3">
          <Form.Control
            type="text"
            name="nomor"
            value={form.nomor}
            onChange={handleChange}
            className={errors.nomor ? "is-invalid register-input" : "register-input"}
          />
          {errors.nomor && <div className="error-text">{errors.nomor}</div>}
        </FloatingLabel>

        {/* ALAMAT */}
        <FloatingLabel label="Alamat" className="mb-3">
          <Form.Control
            type="text"
            name="alamat"
            value={form.alamat}
            onChange={handleChange}
            className={errors.alamat ? "is-invalid register-input" : "register-input"}
          />
          {errors.alamat && <div className="error-text">{errors.alamat}</div>}
        </FloatingLabel>

        {/* PASSWORD */}
        <FloatingLabel label="Password" className="mb-4">
          <Form.Control
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className={errors.password ? "is-invalid register-input" : "register-input"}
          />
          {errors.password && <div className="error-text">{errors.password}</div>}
        </FloatingLabel>

        {/* TOMBOL REGISTER */}
        <Button type="submit" className="register-btn w-100">
          Daftar
        </Button>

        {/* LINK KE LOGIN */}
        <p className="register-login">
          Sudah punya akun?
          <span
            className="register-link"
            onClick={() => navigate("/login")}
          >
            Login di sini
          </span>
        </p>

      </Form>
    </div>
  </div>
);

};

export default RegisterPage;
