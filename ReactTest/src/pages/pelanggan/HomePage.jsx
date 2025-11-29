import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import ImageCarousel from "../../components/ImageCarousel";
import "./HomePage.css";

// IMPORT GAMBAR SESUAI FILE DI FOLDER
import hairColorImg from "../../assets/images/hairColorImg.jpg";
import nailSpaLoungeImg from "../../assets/images/nailSpaLoungeImg.jpg";
import pinkSalonImg from "../../assets/images/pinkSalonImg.jpg";
import haircutImg from "../../assets/images/haircutImg.jpg";
import manicureImg from "../../assets/images/manicureImg.jpg";

const images = [
  {
    img: hairColorImg,
    title: "Hair Coloring",
    description: "Warna rambut profesional dengan hasil menawan."
  },
  {
    img: nailSpaLoungeImg,
    title: "Nail & Spa Lounge",
    description: "Ruang perawatan kuku mewah & nyaman."
  },
  {
    img: pinkSalonImg,
    title: "Aesthetic Hair Salon",
    description: "Salon modern bernuansa pink aesthetic."
  },
  {
    img: haircutImg,
    title: "Haircut Styling",
    description: "Potongan rambut stylish sesuai gaya Anda."
  },
  {
    img: manicureImg,
    title: "Manicure Treatment",
    description: "Kuku cantik untuk penampilan menawan."
  }
];

const HomePage = () => {
  return (
    <div className="home-wrapper">
      {/* CAROUSEL */}
      <ImageCarousel images={images} />

      <Container className="mt-5">
        
        {/* SECTION 1 — ABOUT */}
        <section className="text-center mb-5">
          <h2 className="section-title">Selamat Datang di Aurora Salon</h2>
          <p className="section-subtitle">
            Tempat di mana kecantikan & kenyamanan bertemu. Nikmati layanan terbaik 
            dari profesional berpengalaman, dalam suasana salon yang elegan & modern.
          </p>
        </section>

        {/* SECTION 2 — LAYANAN POPULER */}
        <section className="mb-5">
          <h3 className="section-title mb-4 text-start">Layanan Populer</h3>
          <Row className="g-4">

            <Col md={4}>
              <Card className="service-card">
                <Card.Img variant="top" src={haircutImg} className="service-img" />
                <Card.Body>
                  <Card.Title className="service-title">Haircut Styling</Card.Title>
                  <Card.Text className="service-text">
                    Potongan rambut modern yang cocok untuk semua gaya.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="service-card">
                <Card.Img variant="top" src={hairColorImg} className="service-img" />
                <Card.Body>
                  <Card.Title className="service-title">Hair Coloring</Card.Title>
                  <Card.Text className="service-text">
                    Warna rambut profesional dengan hasil halus & merata.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="service-card">
                <Card.Img variant="top" src={manicureImg} className="service-img" />
                <Card.Body>
                  <Card.Title className="service-title">Manicure Spa</Card.Title>
                  <Card.Text className="service-text">
                    Perawatan kuku elegan untuk tampilan bersih & menawan.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

          </Row>
        </section>

        {/* SECTION 3 — CTA */}
        <section className="text-center my-5">
          <h3 className="cta-title">Siap untuk tampil lebih cantik?</h3>
          <p className="cta-subtitle">Pesan layanan favoritmu sekarang dan rasakan pengalaman terbaik.</p>
          <Button href="/booking" className="cta-btn">Booking Sekarang</Button>
        </section>

      </Container>
    </div>
  );
};

export default HomePage;
