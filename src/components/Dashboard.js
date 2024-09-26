import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  // Dados simulados para os gráficos
  const data = [
    { name: 'Jan', events: 5, participants: 40 },
    { name: 'Feb', events: 10, participants: 70 },
    { name: 'Mar', events: 15, participants: 100 },
    { name: 'Apr', events: 20, participants: 200 },
  ];

  return (
    <Container fluid className="mt-4">
      <h2>Dashboard</h2>
      
      {/* Resumo dos dados em Cards */}
      <Row className="mb-4">
        <Col xs={12} md={4} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total de Eventos</Card.Title>
              <Card.Text>45</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total de Organizadores</Card.Title>
              <Card.Text>10</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total de Participantes</Card.Title>
              <Card.Text>350</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráfico de Eventos e Participantes */}
      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Card.Title>Eventos e Participantes por Mês</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="events" fill="#8884d8" />
                  <Bar dataKey="participants" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
