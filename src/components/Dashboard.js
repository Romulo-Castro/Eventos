import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import fetchWithToken from '../utils/fetchWithToken'; // Utilitário centralizado para requisições

const Dashboard = () => {
  const [totals, setTotals] = useState({ totalEvents: 0, totalParticipants: 0, totalOrganizers: 0 });
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Obter totais
        const totalsData = await fetchWithToken('http://localhost:8080/api/dashboard/totals');
        setTotals(totalsData);

        // Obter dados mensais
        const monthlyDataRaw = await fetchWithToken('http://localhost:8080/api/dashboard/monthly-totals');
        const formattedData = Object.keys(monthlyDataRaw)
          .sort((a, b) => {
            const monthOrder = {
              JANUARY: 1, FEBRUARY: 2, MARCH: 3, APRIL: 4, MAY: 5, JUNE: 6,
              JULY: 7, AUGUST: 8, SEPTEMBER: 9, OCTOBER: 10, NOVEMBER: 11, DECEMBER: 12,
            };
            return monthOrder[a] - monthOrder[b];
          })
          .map((month) => ({
            name: month,
            events: monthlyDataRaw[month]?.events || 0,
            organizers: monthlyDataRaw[month]?.organizers || 0,
            participants: monthlyDataRaw[month]?.participants || 0,
          }));
        setMonthlyData(formattedData);

      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Container fluid className="mt-4">
      <h2 className="mb-4">Dashboard de Eventos</h2>

      {/* Resumo dos Totais */}
      <Row className="mb-4">
        <Col xs={12} md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Total de Eventos</Card.Title>
              <Card.Text>{loading ? <Spinner animation="border" size="sm" /> : totals.totalEvents}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Total de Organizadores</Card.Title>
              <Card.Text>{loading ? <Spinner animation="border" size="sm" /> : totals.totalOrganizers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Total de Participantes</Card.Title>
              <Card.Text>{loading ? <Spinner animation="border" size="sm" /> : totals.totalParticipants}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráfico Principal */}
      <Row>
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Eventos, Organizadores e Participantes por Mês</Card.Title>
              {loading ? (
                <Spinner animation="border" />
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="events" fill="#8884d8" />
                    <Bar dataKey="organizers" fill="#82ca9d" />
                    <Bar dataKey="participants" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráfico Adicional - Tendências de Participação */}
      <Row className="mt-4">
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Tendência de Participação</Card.Title>
              {loading ? (
                <Spinner animation="border" />
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="participants" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Botão de Atualização */}
      <Row className="mt-4">
        <Col xs={12} className="text-center">
          <Button variant="primary" onClick={() => window.location.reload()}>
            Atualizar Dados
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
