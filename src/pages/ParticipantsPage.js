import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner, InputGroup, FormControl } from 'react-bootstrap';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import ToastMessage from '../components/ToastMessage';
import fetchWithToken from '../utils/fetchWithToken';

const ParticipantsPage = () => {
  const [participants, setParticipants] = useState([]);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newParticipant, setNewParticipant] = useState({ name: '', email: '', phone: '', event: '', notes: '' });
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteParticipantId, setDeleteParticipantId] = useState(null);

  useEffect(() => {
    fetchParticipants();
    fetchEvents();
  }, []);

  const fetchParticipants = async () => {
    try {
      const data = await fetchWithToken('http://localhost:8080/api/participants');
      setParticipants(data);
    } catch (error) {
      setToast({ show: true, message: 'Erro ao carregar participantes!', variant: 'danger' });
    }
  };

  const fetchEvents = async () => {
    try {
      const data = await fetchWithToken('http://localhost:8080/api/events');
      setEvents(data);
    } catch (error) {
      setToast({ show: true, message: 'Erro ao carregar eventos!', variant: 'danger' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewParticipant({ ...newParticipant, [name]: value });
  };

  const handleAddOrUpdateParticipant = async () => {
    setLoading(true);

    const participantData = {
      ...newParticipant,
      event: { id: newParticipant.event },
    };

    const url = editMode
      ? `http://localhost:8080/api/participants/${selectedParticipant.id}`
      : 'http://localhost:8080/api/participants';
    const method = editMode ? 'PUT' : 'POST';

    try {
      await fetchWithToken(url, {
        method,
        body: JSON.stringify(participantData),
      });
      setToast({ show: true, message: editMode ? 'Participante editado com sucesso!' : 'Participante adicionado com sucesso!', variant: 'success' });
      setShowModal(false);
      setNewParticipant({ name: '', email: '', phone: '', event: '', notes: '' });
      fetchParticipants();
    } catch {
      setToast({ show: true, message: 'Erro ao cadastrar ou editar participante!', variant: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteParticipant = (id) => {
    setDeleteParticipantId(id);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteParticipantId) return;

    setLoading(true);
    try {
      await fetchWithToken(`http://localhost:8080/api/participants/${deleteParticipantId}`, {
        method: 'DELETE',
      });
      setParticipants(participants.filter(participant => participant.id !== deleteParticipantId));
      setToast({ show: true, message: 'Participante excluído com sucesso!', variant: 'success' });
    } catch (error) {
      setToast({ show: true, message: `Erro ao excluir participante: ${error.message}`, variant: 'danger' });
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
      setDeleteParticipantId(null);
    }
  };

  const handleEditParticipant = (participant) => {
    setEditMode(true);
    setSelectedParticipant(participant);
    setNewParticipant({ ...participant, event: participant.event.id });
    setShowModal(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredParticipants = participants.filter((participant) =>
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (participant.event?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  return (
    <div>
      <h2>Participantes</h2>

      <InputGroup className="mb-3">
        <FormControl
          placeholder="Buscar participantes"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </InputGroup>

      <Button onClick={() => { setShowModal(true); setEditMode(false); }} className="mb-3">
        Adicionar Participante
      </Button>

      <div className="table-responsive">
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Evento</th>
              <th>Notas</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredParticipants.map(participant => (
              <tr key={participant.id}>
                <td>{participant.name}</td>
                <td>{participant.email}</td>
                <td>{participant.phone}</td>
                <td>{participant.event?.name}</td>
                <td>{participant.notes}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEditParticipant(participant)}>
                    <FaEdit />
                  </Button>
                  <Button variant="danger" onClick={() => confirmDeleteParticipant(participant.id)} className="ms-2">
                    <FaTrashAlt />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Editar Participante' : 'Cadastrar Participante'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newParticipant.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newParticipant.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={newParticipant.phone}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Evento</Form.Label>
              <Form.Control
                as="select"
                name="event"
                value={newParticipant.event}
                onChange={handleChange}
              >
                <option value="">Selecione um evento</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>{event.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notas</Form.Label>
              <Form.Control
                as="textarea"
                name="notes"
                value={newParticipant.notes}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleAddOrUpdateParticipant} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Salvar'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação de Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza que deseja excluir este participante?</Modal.Body>
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

export default ParticipantsPage;
