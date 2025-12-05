import React, { useEffect, useState } from "react";
import { Container, Form, FloatingLabel, Button, Row, Col, Card, Spinner } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { apiFetch } from "../../api/api.js";

import "./BookingPage.css";

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preServiceId = location.state?.serviceId || "";

  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    id_layanan: preServiceId,
    id_pegawai: "",
    tanggal_booking: "",
    jam_booking: "",
  });

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (e) {
      return null;
    }
  })();
  const id_pelanggan = user?.id_pelanggan;

  useEffect(() => {
    // redirect to login if not logged in
    if (!user) {
      toast.message?.("Silakan login terlebih dahulu untuk melakukan booking.");
      navigate("/login");
      return;
    }

    let mounted = true;
    setLoading(true);

    Promise.all([apiFetch("/layanan/read"), apiFetch("/pegawai/read")])
      .then(([layananRes, pegawaiRes]) => {
        if (!mounted) return;
        setServices(layananRes || []);
        setStylists(pegawaiRes || []);
      })
      .catch((err) => {
        console.error("Error load layanan/pegawai:", err);
        toast.error("Gagal memuat data. Coba refresh halaman.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id_pelanggan) {
      toast.error("Silakan login terlebih dahulu.");
      navigate("/login");
      return;
    }

    if (!form.id_layanan) return toast.error("Pilih layanan dahulu!");
    if (!form.id_pegawai) return toast.error("Pilih stylist!");
    if (!form.tanggal_booking) return toast.error("Tanggal booking wajib diisi!");
    if (!form.jam_booking) return toast.error("Jam booking wajib diisi!");

    // Kirim jam sebagai string "HH:MM"
    try {
      await apiFetch("/pemesanan/create", {
        method: "POST",
        body: JSON.stringify({
          id_pelanggan,
          id_layanan: form.id_layanan,
          id_pegawai: form.id_pegawai,
          tanggal_pemesanan: new Date().toISOString().slice(0, 10),
          tanggal_booking: form.tanggal_booking,
          jam_booking: form.jam_booking, // <-- dikirim apa adanya "HH:MM"
          status_pemesanan: "pending",
        }),
      });

      toast.success("Booking berhasil dibuat!");
      navigate("/pesanan");
    } catch (err) {
      console.error("BOOKING ERROR:", err);
      // Tampilkan pesan error dari backend bila ada, fallback generic
      const msg = err?.message || err?.msg || (err?.body && err.body.message) || "Gagal melakukan booking";
      toast.error(msg);
    }
  };

  // Helper: tampilkan harga dengan format lokal
  const formatHarga = (h) => {
    if (h === null || h === undefined || h === "") return "-";
    const n = Number(h);
    if (Number.isNaN(n)) return h;
    return n.toLocaleString();
  };

  return (
    <div className="booking-wrapper">
      <Container className="mt-3">
        <Row>
          {/* FORM */}
          <Col md={8}>
            <h2 className="booking-title mb-3">Form Booking</h2>

            {loading ? (
              <div className="py-5 text-center">
                <Spinner animation="border" />
              </div>
            ) : (
              <Form onSubmit={handleSubmit}>
                {/* PILIH LAYANAN */}
                <FloatingLabel label="Pilih Layanan" className="mb-3">
                  <Form.Select
                    name="id_layanan"
                    value={form.id_layanan}
                    onChange={handleChange}
                  >
                    <option value="">-- Pilih layanan --</option>
                    {services.map((s) => (
                      <option key={s.id_layanan} value={s.id_layanan}>
                        {s.nama_layanan} — Rp {formatHarga(s.harga)}
                      </option>
                    ))}
                  </Form.Select>
                </FloatingLabel>

                {/* PILIH STYLIST */}
                <FloatingLabel label="Pilih Stylist" className="mb-3">
                  <Form.Select
                    name="id_pegawai"
                    value={form.id_pegawai}
                    onChange={handleChange}
                  >
                    <option value="">-- Pilih stylist --</option>
                    {stylists.map((st) => (
                      <option key={st.id_pegawai} value={st.id_pegawai}>
                        {st.nama} — {st.jabatan || "Tanpa Jabatan"}
                      </option>
                    ))}
                  </Form.Select>
                </FloatingLabel>

                {/* TANGGAL BOOKING */}
                <FloatingLabel label="Tanggal Booking" className="mb-3">
                  <Form.Control
                    type="date"
                    name="tanggal_booking"
                    value={form.tanggal_booking}
                    onChange={handleChange}
                  />
                </FloatingLabel>

                {/* JAM BOOKING */}
                <FloatingLabel label="Jam Booking" className="mb-3">
                  <Form.Control
                    type="time"
                    name="jam_booking"
                    value={form.jam_booking}
                    onChange={handleChange}
                  />
                </FloatingLabel>

                <Button type="submit" className="btn-booking mt-2">
                  Booking Sekarang
                </Button>
              </Form>
            )}
          </Col>

          {/* RINGKASAN */}
          <Col md={4}>
            <Card className="p-3 ringkasan-card">
              <h5 className="fw-bold">Ringkasan</h5>
              <hr />
              <p className="small text-muted">
                Pastikan memilih layanan, stylist, tanggal, dan jam yang sesuai.
              </p>

              <div className="mt-3">

                <div className="small text-muted">Layanan</div>
                <div className="fw-bold">
                  {services.find(s => s.id_layanan == form.id_layanan)?.nama_layanan || "-"}
                </div>

                <div className="small text-muted mt-2">Stylist</div>
                <div>
                  {stylists.find(p => p.id_pegawai == form.id_pegawai)?.nama || "-"}
                </div>

                <div className="small text-muted mt-2">Tanggal</div>
                <div>{form.tanggal_booking || "-"}</div>

                <div className="small text-muted mt-2">Jam</div>
                <div>{form.jam_booking || "-"}</div>

                {/* HARGA */}
                <div className="small text-muted mt-2">Harga</div>
                <div>
                  Rp{" "}
                  {Number(
                    services.find(s => s.id_layanan == form.id_layanan)?.harga || 0
                  ).toLocaleString()}
                </div>

              </div>
            </Card>
          </Col>

        </Row>
      </Container>
    </div>
  );
};

export default BookingPage;
