package com.example.aula_backend02.service;

import com.example.aula_backend02.model.Event;
import com.example.aula_backend02.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    private final EventRepository eventRepository;

    @Autowired
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    // Método para obter todos os eventos
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // Método para obter um evento pelo ID
    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    // Método para salvar um novo evento ou atualizar um existente
    public Event saveEvent(Event event) {
        return eventRepository.save(event);
    }

    // Método para excluir um evento
    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    // Método para buscar eventos com base no nome (caso queira uma busca personalizada)
    public List<Event> findEventsByName(String name) {
        return eventRepository.findByNameContaining(name);
    }
}
