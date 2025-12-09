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
  LabelList,
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
    { name: "Pesanan", path: "/admin/pesanan" },
    { name: "Pelanggan", path: "/admin/pelanggan" }
    
  ];

  useEffect(() => {
    const load = async () => {
      try {
        setServices((await apiFetch("/layanan/read")) || []);
        setBookings((await apiFetch("/pemesanan/read")) || []);
        setStylists((await apiFetch("/pegawai/read")) || []);

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

  // 📊 GRAFIK PENDAPATAN : berdasarkan tanggal booking pesanan
  const chartData = (() => {
    const monthly = {};

    payments.forEach((p) => {
      const bookingDate = p.pemesanan?.tanggal_booking;
      if (!bookingDate) return;

      const rawDate = bookingDate.replace(" ", "T");
      const date = new Date(rawDate);
      if (isNaN(date.getTime())) return;

      const month = date.toLocaleString("id-ID", { month: "short" });

      monthly[month] = (monthly[month] || 0) + Number(p.total_bayar);
    });

    const monthOrder = [
      "Jan","Feb","Mar","Apr","Mei","Jun",
      "Jul","Agu","Sep","Okt","Nov","Des",
    ];

    return Object.entries(monthly)
      .sort((a, b) => monthOrder.indexOf(a[0]) - monthOrder.indexOf(b[0]))
      .map(([month, total]) => ({ month, total }));
  })();

  const formatCurrency = (value) =>
    "Rp " + Number(value).toLocaleString("id-ID");

  return (
    <>
      <TopNavbar routes={adminNavRoutes} />

      <Container style={{ paddingTop: "100px" }}>
        <h1 className="fw-bold mb-4" style={{ color: "#d63384" }}>
          Dashboard Admin
        </h1>

        {/* Statistik Cards */}
        <Row className="g-4 mb-4">
          <Col md={3}>
            <Card className="shadow-sm p-3 text-center border-0"
              style={{ background: "#ffe6f1", borderRadius: "15px" }}>
              <h6 className="text-muted">Layanan</h6>
              <h2 className="fw-bold">{services.length}</h2>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="shadow-sm p-3 text-center border-0"
              style={{ background: "#ffd0e0", borderRadius: "15px" }}>
              <h6 className="text-muted">Pesanan</h6>
              <h2 className="fw-bold">{bookings.length}</h2>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="shadow-sm p-3 text-center border-0"
              style={{ background: "#ffb3d9", borderRadius: "15px" }}>
              <h6 className="text-muted">Pegawai</h6>
              <h2 className="fw-bold">{stylists.length}</h2>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="shadow-sm p-3 text-center border-0 text-white"
              style={{
                background: "#d63384",
                borderRadius: "15px",
                boxShadow: "0 4px 12px rgba(214,51,132,0.5)",
              }}>
              <h6>Total Pendapatan</h6>
              <h2 className="fw-bold">{formatCurrency(totalRevenue)}</h2>
            </Card>
          </Col>
        </Row>

        {/* 📊 Grafik Pendapatan */}
        <Card
          className="p-4 shadow-lg border-0"
          style={{
            borderRadius: "20px",
            background: "linear-gradient(145deg, #ffe3f4, #ffffff)",
          }}
        >
          <h4 className="fw-bold mb-3" style={{ color: "#c2186b" }}>
            Grafik Pendapatan Bulanan
          </h4>

          {chartData.length === 0 ? (
            <p className="text-muted text-center py-5">
              Belum ada data pembayaran untuk ditampilkan.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="4 4" stroke="#f8c6dd" />
                <XAxis dataKey="month" stroke="#d63384" />
                <YAxis
                  stroke="#d63384"
                  tickFormatter={(val) => "Rp " + val.toLocaleString("id-ID")}
                />

                {/* Tooltip cantik */}
                <Tooltip
                  cursor={{ fill: "rgba(255,182,193,0.3)" }}
                  contentStyle={{
                    backgroundColor: "#fff0f6",
                    border: "1px solid #ff99c8",
                    borderRadius: "10px",
                  }}
                  formatter={(value) => [
                    "Rp " + value.toLocaleString("id-ID"),
                    "Pendapatan",
                  ]}
                />

                {/* Gradient Bar */}
                <defs>
                  <linearGradient id="pinkBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff6f91" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#ff99c8" stopOpacity={0.7} />
                  </linearGradient>
                </defs>

                <Bar
                  dataKey="total"
                  fill="url(#pinkBar)"
                  barSize={45}
                  radius={[12, 12, 0, 0]}
                  animationDuration={1200}
                >
                  <LabelList
                    dataKey="total"
                    position="top"
                    formatter={(v) => "Rp " + v.toLocaleString("id-ID")}
                    style={{ fill: "#c2186b", fontWeight: "bold" }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </Container>
    </>
  );
};

export default AdminDashboardPage;
