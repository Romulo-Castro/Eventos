import React, { useState } from 'react';

const OrganizerForm = ({ onAddOrganizer }) => {
  const [organizerName, setOrganizerName] = useState('');
  const [organizerEmail, setOrganizerEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newOrganizer = {
      name: organizerName,
      email: organizerEmail,
    };
    onAddOrganizer(newOrganizer);
    setOrganizerName('');
    setOrganizerEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="organizer-form">
      <h2>Cadastrar Organizador</h2>
      <input 
        type="text" 
        placeholder="Nome do Organizador" 
        value={organizerName} 
        onChange={(e) => setOrganizerName(e.target.value)} 
        required 
      />
      <input 
        type="email" 
        placeholder="Email" 
        value={organizerEmail} 
        onChange={(e) => setOrganizerEmail(e.target.value)} 
        required 
      />
      <button type="submit">Adicionar Organizador</button>
    </form>
  );
};

export default OrganizerForm;
