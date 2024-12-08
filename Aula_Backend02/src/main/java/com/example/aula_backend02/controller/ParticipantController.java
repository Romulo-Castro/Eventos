package com.example.aula_backend02.controller;

import com.example.aula_backend02.model.Participant;
import com.example.aula_backend02.service.ParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/participants")
public class ParticipantController {

    private final ParticipantService participantService;

    @Autowired
    public ParticipantController(ParticipantService participantService) {
        this.participantService = participantService;
    }

    // Endpoint para obter todos os participantes
    @PreAuthorize("hasRole('ADMIN') or hasRole('ORGANIZER')")
    @GetMapping
    public List<Participant> getAllParticipants() {
        return participantService.getAllParticipants();
    }

    // Endpoint para obter um participante pelo ID
    @PreAuthorize("hasRole('ADMIN') or hasRole('ORGANIZER')")
    @GetMapping("/{id}")
    public ResponseEntity<Participant> getParticipantById(@PathVariable Long id) {
        Optional<Participant> participant = participantService.getParticipantById(id);
        return participant.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint para criar um novo participante
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    @PostMapping
    public Participant createParticipant(@RequestBody Participant participant) {
        return participantService.saveParticipant(participant);
    }

    // Endpoint para atualizar um participante existente
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    @PutMapping("/{id}")
    public ResponseEntity<Participant> updateParticipant(@PathVariable Long id, @RequestBody Participant participantDetails) {
        Optional<Participant> participant = participantService.getParticipantById(id);
        if (participant.isPresent()) {
            Participant participantToUpdate = participant.get();
            // Atualizando os dados do participante
            participantToUpdate.setName(participantDetails.getName());
            participantToUpdate.setEmail(participantDetails.getEmail());
            participantToUpdate.setPhone(participantDetails.getPhone());
            participantToUpdate.setNotes(participantDetails.getNotes());
            participantToUpdate.setEvent(participantDetails.getEvent());
            participantService.saveParticipant(participantToUpdate);
            return ResponseEntity.ok(participantToUpdate);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint para excluir um participante
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteParticipant(@PathVariable Long id) {
        try {
            participantService.deleteParticipant(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao excluir o participante.");
        }
    }
}
