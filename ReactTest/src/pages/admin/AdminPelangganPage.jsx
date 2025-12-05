import React, { useEffect, useState } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import { toast } from "sonner";
import { apiFetch } from "../../api/api.js";
import TopNavbar from "../../components/TopNavbar.jsx";

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
    { name: "Pelanggan", path: "/admin/pelanggan" }, // MENU BARU
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
  // OPEN ADD
  // =============================
  const openAdd = () => {
    setEditing(null);
    setForm({ nama: "", email: "", no_hp: "", alamat: "" });
    setShowModal(true);
  };

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
        // UPDATE
        await apiFetch(`/pelanggan/update/${editing}`, {
          method: "POST",
          body: JSON.stringify(form),
        });

        toast.success("Pelanggan berhasil diupdate");
      } else {
        toast.error("Register pelanggan hanya dari user");
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
        <h2>Kelola Pelanggan</h2>

        <Button className="my-3" onClick={openAdd} disabled>
          Tambah Pelanggan (dinonaktifkan)
        </Button>
        <p className="text-muted">*Pelanggan hanya dapat register dari halaman register.</p>

        <Table bordered hover>
          <thead className="table-primary">
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
                <td colSpan="6" className="text-center">
                  Tidak ada data
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
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => openEdit(p)}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
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
      </Container>

      {/* ========================= */}
      {/* MODAL FORM */}
      {/* ========================= */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editing ? "Edit Pelanggan" : "Tambah Pelanggan"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
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

            <Button type="submit" className="w-100">
              Simpan
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AdminPelangganPage;
