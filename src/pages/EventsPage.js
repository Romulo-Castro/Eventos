import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import ToastMessage from '../components/ToastMessage';
import fetchWithToken from '../utils/fetchWithToken';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newEvent, setNewEvent] = useState({ name: '', date: '', location: '', description: '', organizerId: '' });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setToast({
        show: true,
        message: 'Você não está autenticado.',
        variant: 'danger',
      });
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventsData, organizersData] = await Promise.all([
        fetchWithToken('http://localhost:8080/api/events'),
        fetchWithToken('http://localhost:8080/api/organizers'),
      ]);
      setEvents(eventsData);
      setOrganizers(organizersData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setToast({ show: true, message: error.message, variant: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewEvent({ name: '', date: '', location: '', description: '', organizerId: '' });
    setEditMode(false);
  };

  const handleAddEvent = async () => {
    setLoading(true);
    try {
      if (!newEvent.name || !newEvent.date || !newEvent.location || !newEvent.organizerId) {
        setToast({ show: true, message: 'Preencha todos os campos obrigatórios.', variant: 'warning' });
        setLoading(false);
        return;
      }

      const url = editMode
        ? `http://localhost:8080/api/events/${selectedEvent.id}`
        : 'http://localhost:8080/api/events';
      const method = editMode ? 'PUT' : 'POST';

      const adjustedEvent = {
        ...newEvent,
        organizer: { id: newEvent.organizerId },
      };

      const updatedEvent = await fetchWithToken(url, {
        method,
        body: JSON.stringify(adjustedEvent),
      });

      if (editMode) {
        setEvents(events.map((event) => (event.id === selectedEvent.id ? updatedEvent : event)));
        setToast({ show: true, message: 'Evento atualizado com sucesso!', variant: 'success' });
      } else {
        setEvents([...events, updatedEvent]);
        setToast({ show: true, message: 'Evento criado com sucesso!', variant: 'success' });
      }

      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      setToast({ show: true, message: error.message, variant: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteEvent = (id) => {
    setDeleteEventId(id);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteEventId) return;

    setLoading(true);
    try {
      await fetchWithToken(`http://localhost:8080/api/events/${deleteEventId}`, {
        method: 'DELETE',
      });

      setEvents(events.filter((event) => event.id !== deleteEventId));
      setToast({ show: true, message: 'Evento excluído com sucesso!', variant: 'success' });
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      setToast({ show: true, message: error.message, variant: 'danger' });
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
      setDeleteEventId(null);
    }
  };

  const handleEditEvent = (event) => {
    setEditMode(true);
    setSelectedEvent(event);
    setNewEvent({
      name: event.name,
      date: event.date,
      location: event.location,
      description: event.description,
      organizerId: event.organizer ? event.organizer.id : '',
    });
    setShowModal(true);
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Gestão de Eventos</h2>
      <Form.Control
        type="text"
        placeholder="Buscar por nome ou local"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />

      <Button
        variant="primary"
        onClick={() => {
          setEditMode(false);
          setShowModal(true);
        }}
      >
        Adicionar Evento
      </Button>

      {loading ? (
        <Spinner animation="border" className="mt-4" />
      ) : (
        <div className="table-responsive mt-4">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Data</th>
                <th>Local</th>
                <th>Descrição</th>
                <th>Organizador</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td>{event.name}</td>
                  <td>{event.date}</td>
                  <td>{event.location}</td>
                  <td>{event.description}</td>
                  <td>{event.organizer?.name || 'Não definido'}</td>
                  <td>
                    <Button variant="warning" onClick={() => handleEditEvent(event)} className="me-2">
                      <FaEdit />
                    </Button>
                    <Button variant="danger" onClick={() => confirmDeleteEvent(event.id)}>
                      <FaTrashAlt />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Editar Evento' : 'Cadastrar Evento'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newEvent.name}
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
                value={newEvent.date}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Local</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={newEvent.location}
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
                value={newEvent.description}
                onChange={handleChange}
                placeholder="Digite a descrição"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Organizador</Form.Label>
              <Form.Select
                name="organizerId"
                value={newEvent.organizerId}
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddEvent} disabled={loading}>
            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Salvar'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação de Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza que deseja excluir este evento?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmed}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastMessage
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        variant={toast.variant}
      />
    </div>
  );
};

export default EventsPage;
