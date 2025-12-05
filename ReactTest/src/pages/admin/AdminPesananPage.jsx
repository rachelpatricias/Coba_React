// src/pages/admin/AdminPesananPage.jsx
import React, { useEffect, useState } from "react";
import { Container, Table, Badge } from "react-bootstrap";
import { toast } from "sonner";
import { apiFetch } from "../../api/api.js";
import { formatToAMPM } from "../../utils/time.js";
import TopNavbar from "../../components/TopNavbar.jsx";

const AdminPesananPage = () => {
  const [bookings, setBookings] = useState([]);

  const adminNavRoutes = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Layanan", path: "/admin/layanan" },
    { name: "Pegawai", path: "/admin/pegawai" },
    { name: "Pesanan", path: "/admin/pesanan" },
    { name: "Pelanggan", path: "/admin/pelanggan" }
  ];

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await apiFetch("/pemesanan/read");
      setBookings(data || []);
    } catch {
      toast.error("Gagal memuat pesanan");
    }
  };

  // 🔥 Fungsi untuk menampilkan status dalam bentuk badge
  const renderStatus = (status) => {
    const colors = {
      pending: "warning",
      sedang_dilayani: "primary",
      selesai: "success",
      dibatalkan: "danger",
    };

    const labels = {
      pending: "Pending",
      sedang_dilayani: "Sedang Dilayani",
      selesai: "Selesai",
      dibatalkan: "Dibatalkan",
    };

    return <Badge bg={colors[status] || "secondary"}>{labels[status] || status}</Badge>;
  };

  return (
    <>
      <TopNavbar routes={adminNavRoutes} />

      <Container style={{ paddingTop: "100px" }}>
        <h2>Kelola Pesanan</h2>

        <Table bordered hover>
          <thead className="table-primary">
            <tr>
              <th>No</th>
              <th>Pelanggan</th>
              <th>Layanan</th>
              <th>Tgl. Pesan</th>
              <th>Tgl. Booking</th>
              <th>Jam</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">Belum ada data</td>
              </tr>
            ) : (
              bookings.map((b, i) => (
                <tr key={b.id_pemesanan}>
                  <td>{i + 1}</td>
                  <td>{b.pelanggan?.nama}</td>
                  <td>{b.layanan?.nama_layanan}</td>
                  <td>{b.tanggal_pemesanan}</td>
                  <td>{b.tanggal_booking}</td>
                  <td>{formatToAMPM(b.jam_booking)}</td>
                  <td>{renderStatus(b.status_pemesanan)}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default AdminPesananPage;
