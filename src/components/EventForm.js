import React, { useState } from 'react';

const EventForm = ({ onAddEvent }) => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      name: eventName,
      date: eventDate,
      location: eventLocation,
    };
    onAddEvent(newEvent);
    setEventName('');
    setEventDate('');
    setEventLocation('');
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      <h2>Cadastrar Evento</h2>
      <input 
        type="text" 
        placeholder="Nome do Evento" 
        value={eventName} 
        onChange={(e) => setEventName(e.target.value)} 
        required 
      />
      <input 
        type="date" 
        value={eventDate} 
        onChange={(e) => setEventDate(e.target.value)} 
        required 
      />
      <input 
        type="text" 
        placeholder="Local do Evento" 
        value={eventLocation} 
        onChange={(e) => setEventLocation(e.target.value)} 
        required 
      />
      <button type="submit">Adicionar Evento</button>
    </form>
  );
};

export default EventForm;
