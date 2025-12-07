// src/pages/admin/AdminPegawaiPage.jsx
import { useEffect, useState } from "react";
import { Container, Table, Button, Modal, Form, Card } from "react-bootstrap";
import { toast } from "sonner";
import { apiFetch } from "../../api/api.js";
import TopNavbar from "../../components/TopNavbar";

const THEME = {
  pink: "#d63384",
  darkPink: "#b31b6b",
  softPink: "#ffe6f1",
  hoverPink: "#ff99c8",
};

const AdminPegawaiPage = () => {
  const [pegawai, setPegawai] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    nama: "",
    jabatan: "",
    no_hp: "",
    alamat: "",
  });

  const adminRoutes = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Layanan", path: "/admin/layanan" },
    { name: "Pegawai", path: "/admin/pegawai" },
    { name: "Pesanan", path: "/admin/pesanan" },
    { name: "Pelanggan", path: "/admin/pelanggan" },
  ];

  useEffect(() => {
    fetchPegawai();
  }, []);

  const fetchPegawai = async () => {
    try {
      const data = await apiFetch("/pegawai/read");
      setPegawai(data || []);
    } catch {
      toast.error("Gagal mengambil pegawai");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nama) return toast.error("Nama wajib diisi!");

    try {
      if (editing) {
        await apiFetch("/pegawai/update", {
          method: "POST",
          body: JSON.stringify({ id_pegawai: editing, ...form }),
        });
        toast.success("Data pegawai diperbarui");
      } else {
        await apiFetch("/pegawai/create", {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast.success("Pegawai berhasil ditambahkan");
      }

      setShowModal(false);
      setEditing(null);
      fetchPegawai();
    } catch {
      toast.error("Gagal menyimpan data");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin menghapus pegawai?")) return;

    try {
      await apiFetch(`/pegawai/delete/${id}`, { method: "DELETE" });
      toast.success("Pegawai dihapus");
      fetchPegawai();
    } catch {
      toast.error("Gagal hapus pegawai");
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
          Kelola Pegawai
        </h2>

        {/* CARD WRAPPER */}
        <Card
          className="shadow-sm p-4 mb-4"
          style={{
            background: THEME.softPink,
            borderRadius: "15px",
            border: "none",
          }}
        >
          <Button
            className="mb-3"
            onClick={() => {
              setEditing(null);
              setForm({ nama: "", jabatan: "", no_hp: "", alamat: "" });
              setShowModal(true);
            }}
            style={{
              background: THEME.pink,
              border: "none",
              borderRadius: "20px",
              padding: "8px 18px",
            }}
            onMouseOver={(e) => (e.target.style.background = THEME.darkPink)}
            onMouseOut={(e) => (e.target.style.background = THEME.pink)}
          >
            + Tambah Pegawai
          </Button>

          <Table bordered hover>
            <thead style={{ background: THEME.pink, color: "white" }}>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Jabatan</th>
                <th>No HP</th>
                <th>Alamat</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {pegawai.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-3 text-muted">
                    Belum ada pegawai
                  </td>
                </tr>
              ) : (
                pegawai.map((p, i) => (
                  <tr key={p.id_pegawai}>
                    <td>{i + 1}</td>
                    <td>{p.nama}</td>
                    <td>{p.jabatan}</td>
                    <td>{p.no_hp}</td>
                    <td>{p.alamat}</td>
                    <td>
                      {/* EDIT BUTTON */}
                      <Button
                        size="sm"
                        className="me-2"
                        style={{
                          background: "#ffb3d9",
                          border: "none",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.background = THEME.hoverPink)
                        }
                        onMouseOut={(e) =>
                          (e.target.style.background = "#ffb3d9")
                        }
                        onClick={() => {
                          setEditing(p.id_pegawai);
                          setForm(p);
                          setShowModal(true);
                        }}
                      >
                        Edit
                      </Button>

                      {/* DELETE BUTTON */}
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
                        onClick={() => handleDelete(p.id_pegawai)}
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
            style={{
              background: THEME.pink,
              color: "white",
            }}
          >
            <Modal.Title>
              {editing ? "Edit Pegawai" : "Tambah Pegawai"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body style={{ background: "#fff7fb" }}>
            <Form onSubmit={handleSubmit}>
              {["nama", "jabatan", "no_hp", "alamat"].map((field) => (
                <Form.Group key={field} className="mb-3">
                  <Form.Label>{field.toUpperCase()}</Form.Label>
                  <Form.Control
                    name={field}
                    value={form[field] || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              ))}

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
                onMouseOut={(e) =>
                  (e.target.style.background = THEME.pink)
                }
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

export default AdminPegawaiPage;
