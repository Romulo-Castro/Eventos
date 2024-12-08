import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <Container fluid>
        <Row>
          <Col className="text-center">
            <p className="mb-0">
              © {new Date().getFullYear()} Romulo Narcizo, Davi Ribeiro, Wesley Leonardo. Todos os direitos reservados.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;