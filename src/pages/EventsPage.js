import React, { useState } from 'react';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import ToastMessage from '../components/ToastMessage';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newEvent, setNewEvent] = useState({ name: '', date: '', location: '', description: '' });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleAddEvent = () => {
    setLoading(true);
    setTimeout(() => {
      if (editMode) {
        setEvents(events.map(event => event.id === selectedEvent.id ? { ...selectedEvent, ...newEvent } : event));
        setEditMode(false);
        setSelectedEvent(null);
        setToast({ show: true, message: 'Evento editado com sucesso!', variant: 'success' });
      } else {
        const id = events.length + 1;
        setEvents([...events, { id, ...newEvent }]);
        setToast({ show: true, message: 'Evento adicionado com sucesso!', variant: 'success' });
      }
      setLoading(false);
      setShowModal(false);
      setNewEvent({ name: '', date: '', location: '', description: '' });
    }, 1000);
  };

  const handleDeleteEvent = (id) => {
    setLoading(true);
    setTimeout(() => {
      setEvents(events.filter(event => event.id !== id));
      setLoading(false);
      setToast({ show: true, message: 'Evento removido com sucesso!', variant: 'danger' });
    }, 1000);
  };

  const handleEditEvent = (event) => {
    setEditMode(true);
    setSelectedEvent(event);
    setNewEvent({ ...event });
    setShowModal(true);
  };

  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Eventos</h2>

      <div className="mb-3">
        <Form.Control
          type="text"
          placeholder="Buscar por nome ou local"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Button variant="primary" onClick={() => {
        setEditMode(false);
        setNewEvent({ name: '', date: '', location: '', description: '' });
        setShowModal(true);
      }}>
        Adicionar Evento
      </Button>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Data</th>
            <th>Local</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.map(event => (
            <tr key={event.id}>
              <td>{event.id}</td>
              <td>{event.name}</td>
              <td>{event.date}</td>
              <td>{event.location}</td>
              <td>{event.description}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditEvent(event)} className="me-2">
                  <FaEdit />
                </Button>
                <Button variant="danger" onClick={() => handleDeleteEvent(event.id)} disabled={loading}>
                  <FaTrashAlt />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
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
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={newEvent.date}
                onChange={handleChange}
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddEvent} disabled={loading}>
            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Salvar'}
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
