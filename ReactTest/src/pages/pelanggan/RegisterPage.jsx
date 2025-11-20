import React, { useState } from "react";
import { Container, Form, FloatingLabel, Button } from "react-bootstrap";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nama: "",
    email: "",
    nomor: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = (e) => {
    e.preventDefault();
    const { nama, email, nomor, password } = form;

    if (!nama || !email || !nomor || !password) {
      return toast.error("Semua field harus diisi!");
    }

    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // cek email sudah dipakai
    const emailExist = savedUsers.find((u) => u.email === email);
    if (emailExist) {
      return toast.error("Email sudah terdaftar!");
    }

    const newUser = {
      id: Date.now().toString(),
      username: nama,
      email,
      nomor,
      password,
      loginAt: new Date().toISOString(),
    };

    savedUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(savedUsers));

    toast.success("Registrasi berhasil! Silakan login.");
    navigate("/login");
  };

  return (
    <Container className="mt-5 col-md-6">
      <h2 className="mb-4 text-center">Daftar Pelanggan</h2>
      <Form onSubmit={handleRegister}>
        <FloatingLabel label="Nama Lengkap" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Nama Lengkap"
            name="nama"
            value={form.nama}
            onChange={handleChange}
          />
        </FloatingLabel>

        <FloatingLabel label="Email" className="mb-3">
          <Form.Control
            type="email"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </FloatingLabel>

        <FloatingLabel label="Nomor HP" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Nomor HP"
            name="nomor"
            value={form.nomor}
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

        <Button type="submit" className="w-100">
          Daftar
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterPage;