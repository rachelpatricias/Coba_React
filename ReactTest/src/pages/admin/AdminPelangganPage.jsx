// src/pages/admin/AdminPelangganPage.jsx
import React, { useEffect, useState } from "react";
import { Container, Table, Button, Modal, Form, Card } from "react-bootstrap";
import { toast } from "sonner";
import { apiFetch } from "../../api/api.js";
import TopNavbar from "../../components/TopNavbar.jsx";

const THEME = {
  pink: "#d63384",
  darkPink: "#b31b6b",
  softPink: "#ffe6f1",
  hoverPink: "#ff99c8",
};

const AdminPelangganPage = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    nama: "",
    email: "",
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

  // =============================
  // LOAD DATA
  // =============================
  const loadData = async () => {
    try {
      const res = await apiFetch("/pelanggan/read");
      setData(res);
    } catch {
      toast.error("Gagal memuat data pelanggan");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =============================
  // OPEN EDIT
  // =============================
  const openEdit = (item) => {
    setEditing(item.id_pelanggan);
    setForm({
      nama: item.nama,
      email: item.email,
      no_hp: item.no_hp,
      alamat: item.alamat,
    });
    setShowModal(true);
  };

  // =============================
  // DELETE PELANGGAN
  // =============================
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus pelanggan ini?")) return;

    try {
      await apiFetch(`/pelanggan/delete/${id}`, { method: "DELETE" });
      toast.success("Pelanggan berhasil dihapus");
      loadData();
    } catch {
      toast.error("Gagal menghapus pelanggan");
    }
  };

  // =============================
  // SUBMIT SAVE
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nama || !form.email)
      return toast.error("Nama dan email wajib diisi!");

    try {
      if (editing) {
        await apiFetch(`/pelanggan/update/${editing}`, {
          method: "POST",
          body: JSON.stringify(form),
        });

        toast.success("Pelanggan berhasil diupdate");
      } else {
        toast.error("Pelanggan hanya bisa daftar melalui halaman register");
        return;
      }

      setShowModal(false);
      loadData();
    } catch {
      toast.error("Gagal menyimpan data");
    }
  };

  return (
    <>
      <TopNavbar routes={adminRoutes} />

      <Container style={{ paddingTop: 100 }}>
        <h2
          className="fw-bold mb-3"
          style={{ color: THEME.pink }}
        >
          Kelola Pelanggan
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
            disabled
            style={{
              background: THEME.pink,
              border: "none",
              borderRadius: "20px",
              padding: "8px 18px",
            }}
            onMouseOver={(e) => (e.target.style.background = THEME.darkPink)}
            onMouseOut={(e) => (e.target.style.background = THEME.pink)}
          >
            + Tambah Pelanggan (disabled)
          </Button>

          <p className="text-muted">
            *Pelanggan hanya dapat register melalui halaman Register.
          </p>

          <Table bordered hover>
            <thead style={{ background: THEME.pink, color: "white" }}>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Email</th>
                <th>No HP</th>
                <th>Alamat</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-3 text-muted">
                    Tidak ada data pelanggan
                  </td>
                </tr>
              ) : (
                data.map((p, i) => (
                  <tr key={p.id_pelanggan}>
                    <td>{i + 1}</td>
                    <td>{p.nama}</td>
                    <td>{p.email}</td>
                    <td>{p.no_hp}</td>
                    <td>{p.alamat}</td>
                    <td>
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
                        onClick={() => openEdit(p)}
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
                        onClick={() => handleDelete(p.id_pelanggan)}
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
      </Container>

      {/* MODAL FORM BEAUTIFIED */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header
          closeButton
          style={{
            background: THEME.pink,
            color: "white",
          }}
        >
          <Modal.Title>
            {editing ? "Edit Pelanggan" : "Tambah Pelanggan"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ background: "#fff7fb" }}>
          <Form onSubmit={handleSubmit}>
            {["nama", "email", "no_hp", "alamat"].map((field) => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label>{field.toUpperCase()}</Form.Label>
                <Form.Control
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                />
              </Form.Group>
            ))}

            <Button
              type="submit"
              className="w-100"
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
    </>
  );
};

export default AdminPelangganPage;
