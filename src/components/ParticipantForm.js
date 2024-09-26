import React, { useState } from 'react';

const ParticipantForm = ({ onAddParticipant }) => {
  const [participantName, setParticipantName] = useState('');
  const [participantEmail, setParticipantEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newParticipant = {
      name: participantName,
      email: participantEmail,
    };
    onAddParticipant(newParticipant);
    setParticipantName('');
    setParticipantEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="participant-form">
      <h2>Cadastrar Participante</h2>
      <input 
        type="text" 
        placeholder="Nome do Participante" 
        value={participantName} 
        onChange={(e) => setParticipantName(e.target.value)} 
        required 
      />
      <input 
        type="email" 
        placeholder="Email" 
        value={participantEmail} 
        onChange={(e) => setParticipantEmail(e.target.value)} 
        required 
      />
      <button type="submit">Adicionar Participante</button>
    </form>
  );
};

export default ParticipantForm;
