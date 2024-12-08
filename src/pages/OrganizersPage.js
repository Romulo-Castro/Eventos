import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import ToastMessage from '../components/ToastMessage';
import fetchWithToken from '../utils/fetchWithToken';

const OrganizersPage = () => {
  const [organizers, setOrganizers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newOrganizer, setNewOrganizer] = useState({ name: '', email: '', phone: '', bio: '', company: '', position: '' });
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  // Estados para confirmação de exclusão
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteOrganizerId, setDeleteOrganizerId] = useState(null);

  // Função para buscar organizadores do backend
  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const data = await fetchWithToken('http://localhost:8080/api/organizers');
        setOrganizers(data);
      } catch (error) {
        console.error('Erro ao buscar organizadores:', error);
        setToast({ show: true, message: `Erro ao buscar organizadores: ${error.message}`, variant: 'danger' });
      }
    };

    fetchOrganizers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOrganizer({ ...newOrganizer, [name]: value });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewOrganizer({ name: '', email: '', phone: '', bio: '', company: '', position: '' });
    setEditMode(false);
  };

  const handleAddOrganizer = async () => {
    setLoading(true);
    try {
      const url = editMode
        ? `http://localhost:8080/api/organizers/${selectedOrganizer.id}`
        : 'http://localhost:8080/api/organizers';
      const method = editMode ? 'PUT' : 'POST';

      const updatedOrganizer = await fetchWithToken(url, {
        method,
        body: JSON.stringify(newOrganizer),
      });

      if (editMode) {
        setOrganizers(organizers.map(org => (org.id === selectedOrganizer.id ? updatedOrganizer : org)));
        setToast({ show: true, message: 'Organizador editado com sucesso!', variant: 'success' });
      } else {
        setOrganizers([...organizers, updatedOrganizer]);
        setToast({ show: true, message: 'Organizador adicionado com sucesso!', variant: 'success' });
      }

      handleCloseModal();
    } catch (error) {
      console.error('Erro ao adicionar/editar organizador:', error);
      setToast({ show: true, message: `Erro ao salvar organizador: ${error.message}`, variant: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteOrganizer = (id) => {
    setDeleteOrganizerId(id);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (deleteOrganizerId) {
      setLoading(true);
      try {
        await fetchWithToken(`http://localhost:8080/api/organizers/${deleteOrganizerId}`, {
          method: 'DELETE',
        });

        setOrganizers(organizers.filter(org => org.id !== deleteOrganizerId));
        setToast({ show: true, message: 'Organizador removido com sucesso!', variant: 'success' });
      } catch (error) {
        console.error('Erro ao excluir organizador:', error);
        setToast({ show: true, message: `Erro ao excluir organizador: ${error.message}`, variant: 'danger' });
      } finally {
        setLoading(false);
        setShowConfirmModal(false);
        setDeleteOrganizerId(null);
      }
    }
  };

  const handleEditOrganizer = (organizer) => {
    setEditMode(true);
    setSelectedOrganizer(organizer);
    setNewOrganizer({ ...organizer });
    setShowModal(true);
  };

  const filteredOrganizers = organizers.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Organizadores</h2>

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
        setNewOrganizer({ name: '', email: '', phone: '', bio: '', company: '', position: '' });
        setShowModal(true);
      }}>
        Adicionar Organizador
      </Button>

      <div className="table-responsive mt-4">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Empresa</th>
              <th>Cargo</th>
              <th>Bio</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrganizers.map(org => (
              <tr key={org.id}>
                <td>{org.id}</td>
                <td>{org.name}</td>
                <td>{org.email}</td>
                <td>{org.phone}</td>
                <td>{org.company}</td>
                <td>{org.position}</td>
                <td>{org.bio}</td>
                <td className="d-flex justify-content-center">
                  <Button variant="warning" onClick={() => handleEditOrganizer(org)} className="me-2">
                    <FaEdit />
                  </Button>
                  <Button variant="danger" onClick={() => confirmDeleteOrganizer(org.id)} disabled={loading}>
                    <FaTrashAlt />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Editar Organizador' : 'Cadastrar Organizador'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newOrganizer.name}
                onChange={handleChange}
                placeholder="Digite o nome do organizador"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newOrganizer.email}
                onChange={handleChange}
                placeholder="Digite o email"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={newOrganizer.phone}
                onChange={handleChange}
                placeholder="Digite o telefone"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Empresa</Form.Label>
              <Form.Control
                type="text"
                name="company"
                value={newOrganizer.company}
                onChange={handleChange}
                placeholder="Digite a empresa"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cargo</Form.Label>
              <Form.Control
                type="text"
                name="position"
                value={newOrganizer.position}
                onChange={handleChange}
                placeholder="Digite o cargo"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                name="bio"
                value={newOrganizer.bio}
                onChange={handleChange}
                placeholder="Digite a bio do organizador"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddOrganizer} disabled={loading}>
            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Salvar'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação de Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir este organizador?
        </Modal.Body>
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

export default OrganizersPage;
