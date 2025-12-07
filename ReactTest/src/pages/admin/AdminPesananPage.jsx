// src/pages/admin/AdminPesananPage.jsx
import React, { useEffect, useState } from "react";
import { Container, Table, Badge, Form, Card } from "react-bootstrap";
import { toast } from "sonner";
import { apiFetch } from "../../api/api.js";
import { formatToAMPM } from "../../utils/time.js";
import TopNavbar from "../../components/TopNavbar.jsx";

const THEME = {
  primary: "#d63384",
  softBg: "#fff0f7",
  borderPink: "#f7b6d8",
  accent: "#ff99c8",
};

const AdminPesananPage = () => {
  const [bookings, setBookings] = useState([]);

  const adminNavRoutes = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Layanan", path: "/admin/layanan" },
    { name: "Pegawai", path: "/admin/pegawai" },
    { name: "Pesanan", path: "/admin/pesanan" },
    { name: "Pelanggan", path: "/admin/pelanggan" },
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

  const updateStatus = async (id, status) => {
    const booking = bookings.find((b) => b.id_pemesanan === id);

    try {
      await apiFetch("/pemesanan/update", {
        method: "POST",
        body: JSON.stringify({
          id_pemesanan: id,
          id_layanan: booking.id_layanan,
          id_pegawai: booking.id_pegawai,
          tanggal_booking: booking.tanggal_booking,
          jam_booking: booking.jam_booking,
          status_pemesanan: status,
        }),
      });

      toast.success("Status berhasil diperbarui");
      loadBookings();
    } catch {
      toast.error("Gagal update status");
    }
  };

  const renderBadge = (status) => {
    const style = {
      pending: "warning",
      sedang_dilayani: "info",
      selesai: "success",
      dibatalkan: "danger",
    };

    const label = {
      pending: "Pending",
      sedang_dilayani: "Sedang Dilayani",
      selesai: "Selesai",
      dibatalkan: "Dibatalkan",
    };

    return (
      <Badge
        bg={style[status]}
        style={{ padding: "6px 12px", fontSize: "0.85rem" }}
      >
        {label[status]}
      </Badge>
    );
  };

  return (
    <>
      <TopNavbar routes={adminNavRoutes} />

      <Container style={{ paddingTop: "100px" }}>
        <h2
          className="fw-bold mb-4"
          style={{ color: THEME.primary, borderLeft: `5px solid ${THEME.accent}`, paddingLeft: "12px" }}
        >
          Kelola Pesanan
        </h2>

        <Card
          className="shadow-sm p-3 mb-4"
          style={{
            backgroundColor: THEME.softBg,
            borderRadius: "15px",
            border: `1px solid ${THEME.borderPink}`,
          }}
        >
          <Table bordered hover responsive>
            <thead style={{ background: THEME.accent, color: "white" }}>
              <tr>
                <th>No</th>
                <th>Pelanggan</th>
                <th>Layanan</th>
                <th>Tgl Pesan</th>
                <th>Tgl Booking</th>
                <th>Jam</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    Belum ada data pesanan
                  </td>
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

                    {/* STATUS */}
                    <td>
                      {b.status_pemesanan === "pending" ? (
                        <Form.Select
                          size="sm"
                          value={b.status_pemesanan}
                          onChange={(e) =>
                            updateStatus(b.id_pemesanan, e.target.value)
                          }
                          style={{
                            borderColor: THEME.primary,
                            fontSize: "0.85rem",
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="sedang_dilayani">Sedang Dilayani</option>
                        </Form.Select>
                      ) : (
                        renderBadge(b.status_pemesanan)
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>
      </Container>
    </>
  );
};

export default AdminPesananPage;
