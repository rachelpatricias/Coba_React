// src/pages/pelanggan/HomePage.jsx
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import ImageCarousel from "../../components/ImageCarousel";

// IMPORT GAMBAR SESUAI FILE DI FOLDER
import hairColorImg from "../../assets/images/hairColorImg.jpg";
import nailSpaLoungeImg from "../../assets/images/nailSpaLoungeImg.jpg";
import pinkSalonImg from "../../assets/images/pinkSalonImg.jpg";
import haircutImg from "../../assets/images/haircutImg.jpg";
import manicureImg from "../../assets/images/manicureImg.jpg";

// ARRAY GAMBAR UNTUK CAROUSEL
const images = [
  {
    img: hairColorImg,
    title: "Hair Coloring",
    description: "Warna rambut profesional dengan hasil halus dan merata.",
  },
  {
    img: nailSpaLoungeImg,
    title: "Nail & Spa Lounge",
    description: "Ruang perawatan kuku mewah dengan suasana elegan dan nyaman.",
  },
  {
    img: pinkSalonImg,
    title: "Aesthetic Hair Salon",
    description: "Salon modern bernuansa pink untuk pengalaman perawatan terbaik.",
  },
  {
    img: haircutImg,
    title: "Haircut Styling",
    description: "Potongan rambut presisi yang disesuaikan dengan gaya Anda.",
  },
  {
    img: manicureImg,
    title: "Manicure Treatment",
    description: "Perawatan kuku profesional untuk tampilan bersih dan menawan.",
  },
];

const HomePage = () => {
  return (
    <>
      {/* CAROUSEL */}
      <ImageCarousel images={images} />

      {/* CONTENT */}
      <Container className="mt-5">
        <Row>
          {/* TEXT */}
          <Col md={7}>
            <h2 className="fw-normal">Aurora Salon — Keindahan yang kamu percayakan</h2>
            <p className="lead">
              Layanan profesional: haircut, coloring, styling, manicure, pedicure, dan perawatan wajah.
            </p>
            <p>Login untuk memesan layanan atau lihat daftar layanan terlebih dahulu.</p>
          </Col>

          {/* JAM OPERASIONAL */}
          <Col md={5}>
            <Card className="p-3 shadow">
              <h5>Jam Operasional</h5>
              <p className="mb-0">Senin - Sabtu: 09:00 - 19:00</p>
              <p>Telepon: 0812-XXX-XXXX</p>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomePage;
