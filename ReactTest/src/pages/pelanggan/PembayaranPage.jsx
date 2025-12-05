// src/pages/pelanggan/PembayaranPage.jsx
import React, { useState } from "react";
import { Container, Form, FloatingLabel, Button, Card } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiFetch } from "../../api/api.js";
import "./PembayaranPage.css";

const PembayaranPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const booking = state?.booking || null;
  const [metode, setMetode] = useState("");

  if (!booking) {
    return (
      <Container className="mt-4">
        <h3>Pesanan tidak ditemukan.</h3>
      </Container>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!metode) return toast.error("Pilih metode pembayaran.");

    try {
      await apiFetch("/pembayaran/create", {
        method: "POST",
        body: JSON.stringify({
          id_pemesanan: booking.id_pemesanan,
          metode_pembayaran: metode,
        }),
      });

      toast.success("Pembayaran berhasil!");
      navigate("/pesanan");
    } catch (err) {
      toast.error(err.message || "Pembayaran gagal.");
    }
  };

  return (
    <div className="pembayaran-wrapper">
      <Container className="mt-4">

        <h2 className="pembayaran-title">Pembayaran</h2>

        <Card className="pembayaran-card mb-3">
          <h5>Detail Pesanan</h5>
          <div>Layanan: <strong>{booking.layanan?.nama_layanan}</strong></div>
          <div>Tanggal Booking: {booking.tanggal_booking}</div>
          <div>Jam Booking: {booking.jam_booking}</div>
          <div>Status: {booking.status_pemesanan}</div>

          <div className="mt-2 pembayaran-total">
            <strong>Total Bayar: Rp {booking.layanan?.harga}</strong>
          </div>
        </Card>

        <Form onSubmit={handleSubmit}>
          <FloatingLabel label="Metode Pembayaran" className="mb-3">
            <Form.Select
              value={metode}
              onChange={(e) => setMetode(e.target.value)}
            >
              <option value="">-- Pilih Metode --</option>
              <option value="Cash">Cash</option>
              <option value="Transfer">Transfer</option>
              <option value="E-Wallet">E-Wallet</option>
            </Form.Select>
          </FloatingLabel>

          <Button type="submit" className="btn-bayar">
            Bayar Sekarang
          </Button>
        </Form>

      </Container>
    </div>
  );

};

export default PembayaranPage;
