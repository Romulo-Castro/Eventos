import React, { useState } from 'react';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import ToastMessage from '../components/ToastMessage';

const OrganizersPage = () => {
  const [organizers, setOrganizers] = useState([]); // Inicializando com um array vazio
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false); // Para controlar se está no modo de edição
  const [searchTerm, setSearchTerm] = useState(''); // Filtro de pesquisa
  const [newOrganizer, setNewOrganizer] = useState({ name: '', email: '', phone: '', bio: '', company: '', role: '' });
  const [selectedOrganizer, setSelectedOrganizer] = useState(null); // Para o organizador a ser editado
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOrganizer({ ...newOrganizer, [name]: value });
  };

  const handleAddOrganizer = () => {
    setLoading(true);
    setTimeout(() => {
      if (editMode) {
        // Atualiza o organizador existente
        setOrganizers(organizers.map(org => org.id === selectedOrganizer.id ? { ...selectedOrganizer, ...newOrganizer } : org));
        setEditMode(false);
        setSelectedOrganizer(null);
        setToast({ show: true, message: 'Organizador editado com sucesso!', variant: 'success' });
      } else {
        // Adiciona um novo organizador
        const id = organizers.length + 1;
        setOrganizers([...organizers, { id, ...newOrganizer }]);
        setToast({ show: true, message: 'Organizador adicionado com sucesso!', variant: 'success' });
      }
      setLoading(false);
      setShowModal(false);
      setNewOrganizer({ name: '', email: '', phone: '', bio: '', company: '', role: '' }); // Resetar o formulário
    }, 1000);
  };

  const handleDeleteOrganizer = (id) => {
    setLoading(true);
    setTimeout(() => {
      setOrganizers(organizers.filter(org => org.id !== id));
      setLoading(false);
      setToast({ show: true, message: 'Organizador removido com sucesso!', variant: 'danger' });
    }, 1000);
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
        setNewOrganizer({ name: '', email: '', phone: '', bio: '', company: '', role: '' }); // Resetar o formulário
        setShowModal(true);
      }}>
        Adicionar Organizador
      </Button>

      <Table striped bordered hover className="mt-4">
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
              <td>{org.role}</td>
              <td>{org.bio}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditOrganizer(org)} className="me-2">
                  <FaEdit />
                </Button>
                <Button variant="danger" onClick={() => handleDeleteOrganizer(org.id)} disabled={loading}>
                  <FaTrashAlt />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
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
                name="role"
                value={newOrganizer.role}
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddOrganizer} disabled={loading}>
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

export default OrganizersPage;
