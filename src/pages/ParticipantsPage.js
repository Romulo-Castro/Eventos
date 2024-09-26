import React, { useState } from 'react';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import ToastMessage from '../components/ToastMessage';

const ParticipantsPage = () => {
  const [participants, setParticipants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newParticipant, setNewParticipant] = useState({ name: '', email: '', phone: '', event: '', notes: '' });
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewParticipant({ ...newParticipant, [name]: value });
  };

  const handleAddParticipant = () => {
    setLoading(true);
    setTimeout(() => {
      if (editMode) {
        setParticipants(participants.map(part => part.id === selectedParticipant.id ? { ...selectedParticipant, ...newParticipant } : part));
        setEditMode(false);
        setSelectedParticipant(null);
        setToast({ show: true, message: 'Participante editado com sucesso!', variant: 'success' });
      } else {
        const id = participants.length + 1;
        setParticipants([...participants, { id, ...newParticipant }]);
        setToast({ show: true, message: 'Participante adicionado com sucesso!', variant: 'success' });
      }
      setLoading(false);
      setShowModal(false);
      setNewParticipant({ name: '', email: '', phone: '', event: '', notes: '' });
    }, 1000);
  };

  const handleDeleteParticipant = (id) => {
    setLoading(true);
    setTimeout(() => {
      setParticipants(participants.filter(part => part.id !== id));
      setLoading(false);
      setToast({ show: true, message: 'Participante removido com sucesso!', variant: 'danger' });
    }, 1000);
  };

  const handleEditParticipant = (participant) => {
    setEditMode(true);
    setSelectedParticipant(participant);
    setNewParticipant({ ...participant });
    setShowModal(true);
  };

  const filteredParticipants = participants.filter(part => 
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Participantes</h2>

      <div className="mb-3">
        <Form.Control
          type="text"
          placeholder="Buscar por nome ou email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Button variant="primary" onClick={() => {
        setEditMode(false);
        setNewParticipant({ name: '', email: '', phone: '', event: '', notes: '' });
        setShowModal(true);
      }}>
        Adicionar Participante
      </Button>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Evento</th>
            <th>Notas</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredParticipants.map(part => (
            <tr key={part.id}>
              <td>{part.id}</td>
              <td>{part.name}</td>
              <td>{part.email}</td>
              <td>{part.phone}</td>
              <td>{part.event}</td>
              <td>{part.notes}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditParticipant(part)} className="me-2">
                  <FaEdit />
                </Button>
                <Button variant="danger" onClick={() => handleDeleteParticipant(part.id)} disabled={loading}>
                  <FaTrashAlt />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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
                placeholder="Digite o nome do participante"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newParticipant.email}
                onChange={handleChange}
                placeholder="Digite o email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={newParticipant.phone}
                onChange={handleChange}
                placeholder="Digite o telefone"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Evento</Form.Label>
              <Form.Control
                type="text"
                name="event"
                value={newParticipant.event}
                onChange={handleChange}
                placeholder="Digite o evento"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notas</Form.Label>
              <Form.Control
                as="textarea"
                name="notes"
                value={newParticipant.notes}
                onChange={handleChange}
                placeholder="Digite notas sobre o participante"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddParticipant} disabled={loading}>
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

export default ParticipantsPage;
