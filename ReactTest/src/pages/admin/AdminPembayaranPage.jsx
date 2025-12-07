import React, { useEffect, useState } from "react";
import { Container, Form, FloatingLabel, Button, Card } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiFetch } from "../../api/api.js";

// 🎨 THEME PINK AESTHETIC
const THEME = {
  primary: "#d63384",
  dark: "#b31b6b",
  soft: "#fff0f7",
  accent: "#ff99c8",
};

const AdminPembayaranPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pembayaranId = location.state?.pembayaranId || null;

  const [pembayaran, setPembayaran] = useState(null);
  const [form, setForm] = useState({ status_pembayaran: "" });

  useEffect(() => {
    const loadPembayaran = async () => {
      if (!pembayaranId) return;

      try {
        const data = await apiFetch(`/admin/pembayaran/${pembayaranId}`);
        setPembayaran(data);
        setForm({ status_pembayaran: data.status_pembayaran });
      } catch {
        toast.error("Gagal memuat data pembayaran.");
      }
    };

    loadPembayaran();
  }, [pembayaranId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.status_pembayaran) {
      return toast.error("Pilih status pembayaran.");
    }

    try {
      await apiFetch(`/admin/pembayaran/${pembayaranId}/update-status`, {
        method: "PUT",
        body: JSON.stringify({
          status_pembayaran: form.status_pembayaran,
        }),
      });

      toast.success("Status pembayaran berhasil diperbarui.");
      navigate("/admin/pembayaran");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Gagal memperbarui status.");
    }
  };

  if (!pembayaran) {
    return (
      <Container className="mt-4">
        <h3>Memuat data pembayaran...</h3>
      </Container>
    );
  }

  return (
    <Container style={{ paddingTop: "100px", paddingBottom: "50px" }}>
      <h2 className="fw-bold mb-4" style={{ color: THEME.primary }}>
        Update Status Pembayaran
      </h2>

      {/* DETAIL PEMBAYARAN */}
      <Card
        className="shadow-sm p-4 mb-4"
        style={{
          background: THEME.soft,
          borderRadius: "15px",
          border: `2px solid ${THEME.primary}`,
        }}
      >
        <h5 className="fw-bold mb-3" style={{ color: THEME.dark }}>
          Detail Pembayaran
        </h5>

        <div className="mb-1">ID Pembayaran: <strong>{pembayaran.id_pembayaran}</strong></div>
        <div className="mb-1">ID Pemesanan: <strong>{pembayaran.id_pemesanan}</strong></div>
        <div className="mb-1">Layanan: <strong>{pembayaran.pemesanan?.layanan?.nama_layanan}</strong></div>
        <div className="mb-1">Tanggal Booking: <strong>{pembayaran.pemesanan?.tanggal_booking}</strong></div>
        <div className="mb-1">Jam Booking: <strong>{pembayaran.pemesanan?.jam_booking}</strong></div>

        <div className="mt-3 mb-2">
          <strong style={{ color: THEME.primary }}>
            Total Bayar: Rp {pembayaran.pemesanan?.layanan?.harga}
          </strong>
        </div>

        <div className="mt-2">
          Status Pembayaran Saat Ini:{" "}
          <strong style={{ color: THEME.dark }}>{pembayaran.status_pembayaran}</strong>
        </div>
      </Card>

      {/* FORM UPDATE */}
      <Card
        className="shadow-sm p-4"
        style={{
          borderRadius: "15px",
          border: "none",
          background: "white",
        }}
      >
        <Form onSubmit={handleSubmit}>
          <FloatingLabel label="Status Pembayaran" className="mb-3">
            <Form.Select
              name="status_pembayaran"
              value={form.status_pembayaran}
              onChange={handleChange}
              style={{ borderColor: THEME.primary }}
            >
              <option value="pending">Menunggu</option>
              <option value="lunas">Lunas</option>
            </Form.Select>
          </FloatingLabel>

          <Button
            type="submit"
            className="w-100"
            style={{
              background: THEME.primary,
              borderRadius: "20px",
              border: "none",
            }}
            onMouseOver={(e) => (e.target.style.background = THEME.dark)}
            onMouseOut={(e) => (e.target.style.background = THEME.primary)}
          >
            Update Status
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default AdminPembayaranPage;
