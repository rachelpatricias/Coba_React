// src/pages/admin/AdminLayananPage.jsx
import { useEffect, useState } from "react";
import { Container, Table, Button, Modal, Form, Card } from "react-bootstrap";
import { toast } from "sonner";
import { apiFetch } from "../../api/api.js";
import TopNavbar from "../../components/TopNavbar.jsx";

const THEME = {
  pink: "#d63384",
  softPink: "#ffe6f1",
  darkPink: "#b31b6b",
  hoverPink: "#ff99c8",
};

const AdminLayananPage = () => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    nama_layanan: "",
    harga: "",
    deskripsi: "",
  });

  const adminRoutes = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Layanan", path: "/admin/layanan" },
    { name: "Pegawai", path: "/admin/pegawai" },
    { name: "Pesanan", path: "/admin/pesanan" },
    { name: "Pelanggan", path: "/admin/pelanggan" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await apiFetch("/layanan/read");
      setServices(data || []);
    } catch {
      toast.error("Gagal mengambil data layanan");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = () => {
    setEditing(null);
    setForm({ nama_layanan: "", harga: "", deskripsi: "" });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditing(item.id_layanan);
    setForm({
      nama_layanan: item.nama_layanan,
      harga: item.harga,
      deskripsi: item.deskripsi,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus layanan?")) return;

    try {
      await apiFetch(`/layanan/delete/${id}`, {
        method: "DELETE",
      });
      toast.success("Berhasil dihapus");
      fetchData();
    } catch {
      toast.error("Gagal menghapus layanan");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nama_layanan || !form.harga)
      return toast.error("Nama & harga wajib diisi!");

    try {
      if (editing) {
        await apiFetch("/layanan/update", {
          method: "POST",
          body: JSON.stringify({ id_layanan: editing, ...form }),
        });
        toast.success("Berhasil diperbarui");
      } else {
        await apiFetch("/layanan/create", {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast.success("Berhasil ditambahkan");
      }

      setShowModal(false);
      fetchData();
    } catch {
      toast.error("Gagal menyimpan data");
    }
  };

  return (
    <>
      <TopNavbar routes={adminRoutes} />

      <Container style={{ paddingTop: "100px" }}>
        <h2
          className="fw-bold mb-3"
          style={{ color: THEME.pink }}
        >
          Kelola Layanan
        </h2>

        {/* Card Wrapper */}
        <Card
          className="shadow-sm p-4 mb-4 border-0"
          style={{
            background: THEME.softPink,
            borderRadius: "15px",
          }}
        >
          <Button
            className="mb-3"
            onClick={handleAdd}
            style={{
              background: THEME.pink,
              border: "none",
              borderRadius: "20px",
              padding: "8px 18px",
            }}
            onMouseOver={(e) => (e.target.style.background = THEME.darkPink)}
            onMouseOut={(e) => (e.target.style.background = THEME.pink)}
          >
            + Tambah Layanan
          </Button>

          <Table bordered hover>
            <thead style={{ background: THEME.pink, color: "white" }}>
              <tr>
                <th>No</th>
                <th>Nama Layanan</th>
                <th>Harga</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-3 text-muted">
                    Belum ada layanan
                  </td>
                </tr>
              ) : (
                services.map((s, i) => (
                  <tr key={s.id_layanan}>
                    <td>{i + 1}</td>
                    <td>{s.nama_layanan}</td>
                    <td>Rp {Number(s.harga).toLocaleString("id-ID")}</td>
                    <td>{s.deskripsi}</td>
                    <td>
                      <Button
                        size="sm"
                        style={{
                          background: "#ffb3d9",
                          border: "none",
                          marginRight: "6px",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.background = THEME.hoverPink)
                        }
                        onMouseOut={(e) =>
                          (e.target.style.background = "#ffb3d9")
                        }
                        onClick={() => handleEdit(s)}
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        style={{
                          background: "#ff4d6d",
                          border: "none",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.background = "#d90429")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.background = "#ff4d6d")
                        }
                        onClick={() => handleDelete(s.id_layanan)}
                      >
                        Hapus
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>

        {/* MODAL FORM */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header
            closeButton
            style={{ background: THEME.pink, color: "white" }}
          >
            <Modal.Title>{editing ? "Edit Layanan" : "Tambah Layanan"}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ background: "#fff7fb" }}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nama Layanan</Form.Label>
                <Form.Control
                  name="nama_layanan"
                  value={form.nama_layanan}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Harga</Form.Label>
                <Form.Control
                  name="harga"
                  type="number"
                  value={form.harga}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Deskripsi</Form.Label>
                <Form.Control
                  name="deskripsi"
                  value={form.deskripsi}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button
                type="submit"
                className="w-100 mt-2"
                style={{
                  background: THEME.pink,
                  border: "none",
                  borderRadius: "20px",
                }}
                onMouseOver={(e) =>
                  (e.target.style.background = THEME.darkPink)
                }
                onMouseOut={(e) => (e.target.style.background = THEME.pink)}
              >
                Simpan
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default AdminLayananPage;
