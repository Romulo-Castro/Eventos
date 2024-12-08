import React, { useState } from 'react';

const ParticipantForm = ({ onAddParticipant, events }) => {
  const [participantName, setParticipantName] = useState('');
  const [participantEmail, setParticipantEmail] = useState('');
  const [participantPhone, setParticipantPhone] = useState('');
  const [participantEvent, setParticipantEvent] = useState(''); // Estado para o evento selecionado
  const [participantNotes, setParticipantNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newParticipant = {
      name: participantName,
      email: participantEmail,
      phone: participantPhone,
      event: participantEvent, // Evento selecionado
      notes: participantNotes,
    };
    onAddParticipant(newParticipant);
    setParticipantName('');
    setParticipantEmail('');
    setParticipantPhone('');
    setParticipantEvent('');
    setParticipantNotes('');
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
      <input 
        type="text" 
        placeholder="Telefone" 
        value={participantPhone} 
        onChange={(e) => setParticipantPhone(e.target.value)} 
      />
      
      {/* Campo de seleção para o evento */}
      <select 
        value={participantEvent} 
        onChange={(e) => setParticipantEvent(e.target.value)} 
        required
      >
        <option value="">Selecione um evento</option>
        {events.map(event => (
          <option key={event.id} value={event.id}>{event.name}</option>
        ))}
      </select>

      <textarea 
        placeholder="Notas sobre o participante" 
        value={participantNotes} 
        onChange={(e) => setParticipantNotes(e.target.value)} 
      />
      <button type="submit">Adicionar Participante</button>
    </form>
  );
};

export default ParticipantForm;
