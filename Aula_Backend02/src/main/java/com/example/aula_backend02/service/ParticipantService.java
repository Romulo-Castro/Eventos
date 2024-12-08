package com.example.aula_backend02.service;

import com.example.aula_backend02.model.Participant;
import com.example.aula_backend02.repository.ParticipantRepository;
import com.example.aula_backend02.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ParticipantService {

    private final ParticipantRepository participantRepository;
    private final EventRepository eventRepository; // Adicionado para validar eventos

    @Autowired
    public ParticipantService(ParticipantRepository participantRepository, EventRepository eventRepository) {
        this.participantRepository = participantRepository;
        this.eventRepository = eventRepository;
    }

    // Retorna todos os participantes
    public List<Participant> getAllParticipants() {
        return participantRepository.findAll();
    }

    // Retorna um participante por ID
    public Optional<Participant> getParticipantById(Long id) {
        return participantRepository.findById(id);
    }

    // Cria um novo participante
    public Participant createParticipant(Participant participant) {
        if (participant.getEvent() != null && !eventRepository.existsById(participant.getEvent().getId())) {
            throw new IllegalArgumentException("Evento associado não existe.");
        }
        return participantRepository.save(participant);
    }

    // Atualiza um participante existente
    public Optional<Participant> updateParticipant(Long id, Participant participantDetails) {
        Optional<Participant> existingParticipant = participantRepository.findById(id);
        if (existingParticipant.isPresent()) {
            Participant participantToUpdate = existingParticipant.get();
            participantToUpdate.setName(participantDetails.getName());
            participantToUpdate.setEmail(participantDetails.getEmail());
            participantToUpdate.setPhone(participantDetails.getPhone());
            participantToUpdate.setNotes(participantDetails.getNotes());

            if (participantDetails.getEvent() != null) {
                if (!eventRepository.existsById(participantDetails.getEvent().getId())) {
                    throw new IllegalArgumentException("Evento associado não existe.");
                }
                participantToUpdate.setEvent(participantDetails.getEvent());
            }

            return Optional.of(participantRepository.save(participantToUpdate));
        } else {
            return Optional.empty();
        }
    }

    // Método para salvar um participante
    public Participant saveParticipant(Participant participant) {
        if (participant.getEvent() != null && !eventRepository.existsById(participant.getEvent().getId())) {
            throw new IllegalArgumentException("Evento associado não existe.");
        }
        return participantRepository.save(participant);
    }

    // Deleta um participante
    public void deleteParticipant(Long id) {
        participantRepository.deleteById(id);
    }

    // Contar participantes por evento
    public int countParticipantsByEvent(Long eventId) {
        return participantRepository.countByEventId(eventId);
    }
}
