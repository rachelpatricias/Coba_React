// src/pages/pelanggan/PesananPage.jsx
import React, { useEffect, useState } from "react";
import { Container, Table, Button, Badge, Modal } from "react-bootstrap";
import { toast } from "sonner";
import { apiFetch } from "../../api/api";
import { formatToAMPM } from "../../utils/time";
import { useNavigate } from "react-router-dom";
import "./PesananPage.css";

const PesananPage = () => {
  const [data, setData] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await apiFetch("/pemesanan/read");
      setData(res);
    } catch {
      toast.error("Gagal memuat pesanan");
    }
  };

  useEffect(() => {
    load();
  }, []);

  // 🔥 Tampilkan modal, simpan ID
  const openCancelModal = (id) => {
    setSelectedId(id);
    setShowCancelModal(true);
  };

  // 🔥 Lakukan pembatalan
  const confirmCancel = async () => {
    try {
      await apiFetch(`/pemesanan/delete/${selectedId}`, { method: "DELETE" });

      toast.success("Pesanan berhasil dibatalkan");
      setShowCancelModal(false);
      load();
    } catch {
      toast.error("Gagal membatalkan pesanan");
    }
  };

  const renderStatus = (status) => {
    const colors = {
      pending: "warning",
      sedang_dilayani: "info",
      selesai: "success",
      dibatalkan: "danger",
    };

    const labels = {
      pending: "Pending",
      sedang_dilayani: "Sedang Dilayani",
      selesai: "Selesai",
      dibatalkan: "Dibatalkan",
    };

    return (
      <Badge bg={colors[status] || "secondary"} style={{ padding: "6px 12px" }}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <div className="pesanan-wrapper">
      <Container className="mt-4">
        <h1 className="pesanan-title">Daftar Pesanan</h1>

        <div className="pesanan-table-wrapper">
          <Table hover responsive className="pesanan-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Layanan</th>
                <th>Tanggal Booking</th>
                <th>Jam Booking</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    Belum ada pesanan.
                  </td>
                </tr>
              ) : (
                data.map((p, idx) => (
                  <tr key={p.id_pemesanan}>
                    <td>{idx + 1}</td>
                    <td>{p.layanan?.nama_layanan}</td>
                    <td>{p.tanggal_booking}</td>
                    <td>{formatToAMPM(p.jam_booking)}</td>
                    <td>{renderStatus(p.status_pemesanan)}</td>

                    <td>
                      {p.status_pemesanan === "pending" ? (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            className="me-2"
                            onClick={() =>
                              navigate("/pembayaran", {
                                state: { booking: p },
                              })
                            }
                          >
                            Bayar
                          </Button>

                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => openCancelModal(p.id_pemesanan)}
                          >
                            Batalkan
                          </Button>
                        </>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Container>

      {/* 🟣 MODAL KONFIRMASI BATALKAN */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Pembatalan</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Apakah Anda yakin ingin membatalkan pesanan ini?
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Tidak
          </Button>
          <Button variant="danger" onClick={confirmCancel}>
            Ya, Batalkan Pesanan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PesananPage;
