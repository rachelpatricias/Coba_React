import { Carousel, Container } from "react-bootstrap";
import "./ImageCarousel.css";

const ImageCarousel = ({ images }) => {
  return (
    <Container className="carousel-container">
      <Carousel className="rounded-carousel">
        {images?.map((image, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100 carousel-image"
              src={image.img}
              alt={image.title}
            />
            <Carousel.Caption>
              <h3>{image.title}</h3>
              <p>{image.description}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
};

export default ImageCarousel;
