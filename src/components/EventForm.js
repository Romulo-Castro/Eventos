import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';

const EventForm = ({ event, onClose, onSuccess, editMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    description: '',
    organizerId: '',
  });
  const [loading, setLoading] = useState(false);
  const [organizers, setOrganizers] = useState([]);

  const token = localStorage.getItem('token');

  // Carregar organizadores
  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/organizers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error('Erro ao buscar organizadores');
        }
        const data = await response.json();
        setOrganizers(data);
      } catch (error) {
        console.error('Erro ao buscar organizadores:', error);
      }
    };
    fetchOrganizers();
  }, [token]);

  // Preencher os campos no modo de edição
  useEffect(() => {
    if (editMode && event) {
      setFormData({
        name: event.name,
        date: event.date,
        location: event.location,
        description: event.description,
        organizerId: event.organizer?.id || '',
      });
    }
  }, [editMode, event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const adjustedEvent = {
        ...formData,
        organizer: formData.organizerId ? { id: formData.organizerId } : null,
      };
      await onSuccess(adjustedEvent); // Passa os dados ajustados para a função pai
      onClose();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Nome</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Digite o nome do evento"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Data</Form.Label>
        <Form.Control
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Local</Form.Label>
        <Form.Control
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Digite o local"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Descrição</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Digite a descrição do evento"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Organizador</Form.Label>
        <Form.Select
          name="organizerId"
          value={formData.organizerId}
          onChange={handleChange}
          required
        >
          <option value="">Selecione um organizador</option>
          {organizers.map((organizer) => (
            <option key={organizer.id} value={organizer.id}>
              {organizer.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : <FaSave />} Salvar
      </Button>
    </Form>
  );
};

export default EventForm;
