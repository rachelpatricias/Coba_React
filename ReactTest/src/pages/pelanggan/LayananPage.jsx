// src/pages/pelanggan/LayananPage.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api/api.js";

import "./LayananPage.css";

const LayananPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/layanan/read")
      .then((res) => setServices(res || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="layanan-wrapper">
      <Container className="py-4">

        <div className="text-center mb-4">
          <h1 className="layanan-title">Layanan Salon Kami</h1>
          <p className="layanan-subtitle">
            Pilih layanan terbaik dari Aurora Salon yang siap membuatmu tampil memukau.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="danger" />
            <p className="mt-3 text-muted">Mengambil data layanan...</p>
          </div>
        ) : (
          <Row className="g-4">
            {services.map((svc) => (
              <Col md={4} key={svc.id_layanan}>
                <Card className="layanan-card shadow-sm">

                  <Card.Body>
                    <Card.Title className="fw-bold layanan-name">
                      {svc.nama_layanan}
                    </Card.Title>

                    <Card.Text className="layanan-description">
                      {svc.deskripsi}
                    </Card.Text>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        <div className="harga-label">Harga</div>
                        <div className="layanan-harga">
                          Rp {Number(svc.harga).toLocaleString()}
                        </div>
                      </div>

                      <Button
                        className="btn-booking"
                        onClick={() =>
                          navigate("/booking", { state: { serviceId: svc.id_layanan } })
                        }
                      >
                        Booking
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

      </Container>
    </div>
  );
};

export default LayananPage;
