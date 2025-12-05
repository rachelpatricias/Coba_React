// src/pages/admin/AdminDashboardPage.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { apiFetch } from "../../api/api.js";
import TopNavbar from "../../components/TopNavbar.jsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const AdminDashboardPage = () => {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [payments, setPayments] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const adminNavRoutes = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Layanan", path: "/admin/layanan" },
    { name: "Pegawai", path: "/admin/pegawai" },
    { name: "Pelanggan", path: "/admin/pelanggan" },
    { name: "Pesanan", path: "/admin/pesanan" },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        setServices(await apiFetch("/layanan/read") || []);
        setBookings(await apiFetch("/pemesanan/read") || []);
        setStylists(await apiFetch("/pegawai/read") || []);

        const pay = await apiFetch("/pembayaran/read");
        setPayments(pay || []);

        const total = await apiFetch("/pembayaran/pendapatan");
        setTotalRevenue(total.total || 0);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  // 📊 GRAFIK: Ambil bulan dari tanggal pembayaran (tanggal_pembayaran)
  const chartData = (() => {
  const monthly = {};

  payments.forEach((p) => {
    const bookingDate = p.pemesanan?.tanggal_booking;
    if (!bookingDate) return;

    // Ubah format tanggal booking biar valid untuk Date()
    const rawDate = bookingDate.replace(" ", "T");
    const date = new Date(rawDate);

    if (isNaN(date.getTime())) {
      console.warn("Tanggal booking invalid:", bookingDate);
      return;
    }

    const month = date.toLocaleString("id-ID", { month: "short" });

    monthly[month] = (monthly[month] || 0) + Number(p.total_bayar);
  });

  const monthOrder = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

  return Object.entries(monthly)
    .sort((a, b) => monthOrder.indexOf(a[0]) - monthOrder.indexOf(b[0]))
    .map(([month, total]) => ({ month, total }));
})();



  return (
    <>
      <TopNavbar routes={adminNavRoutes} />

      <Container style={{ paddingTop: "100px" }}>
        <h1 className="mb-4">Admin Dashboard</h1>

        {/* Statistik */}
        <Row className="g-3 mb-4">
          <Col md={3}>
            <Card className="p-3 text-center shadow-sm">
              <h5>Layanan</h5>
              <div className="display-6">{services.length}</div>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="p-3 text-center shadow-sm">
              <h5>Pesanan</h5>
              <div className="display-6">{bookings.length}</div>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="p-3 text-center shadow-sm">
              <h5>Pegawai</h5>
              <div className="display-6">{stylists.length}</div>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="p-3 text-center shadow-sm bg-success text-white">
              <h5>Total Pendapatan</h5>
              <div className="display-6">
                Rp {Number(totalRevenue).toLocaleString("id-ID")}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Grafik */}
        <Card className="p-4 shadow-sm">
          <h4 className="mb-3">Grafik Pendapatan Bulanan</h4>

          {chartData.length === 0 ? (
            <p className="text-muted">Belum ada data pembayaran</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#ff6f91" barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </Container>
    </>
  );
};

export default AdminDashboardPage;
