// src/pages/pelanggan/PesananPage.jsx
import React, { useEffect, useState } from "react";
import { Container, Table, Button, Badge } from "react-bootstrap";
import { toast } from "sonner";
import { apiFetch } from "../../api/api";
import { formatToAMPM } from "../../utils/time";
import { useNavigate } from "react-router-dom";
import "./PesananPage.css";

const PesananPage = () => {
  const [data, setData] = useState([]);
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

  const cancel = async (id) => {
    try {
      await apiFetch(`/pemesanan/delete/${id}`, { method: "DELETE" });
      toast.success("Pesanan dibatalkan");
      load();
    } catch {
      toast.error("Gagal membatalkan pesanan");
    }
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
                    <td>{formatToAMPM(p.jam_booking || "00:00")}</td>

                    <td>
                      <Badge
                        bg={p.status_pemesanan === "pending" ? "warning" : "success"}
                      >
                        {p.status_pemesanan}
                      </Badge>
                    </td>

                    <td>
                      {p.status_pemesanan === "pending" && (
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
                            onClick={() => cancel(p.id_pemesanan)}
                          >
                            Batalkan
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Container>
    </div>
  );
};

export default PesananPage;
