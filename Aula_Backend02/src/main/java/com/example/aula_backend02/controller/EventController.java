package com.example.aula_backend02.controller;

import com.example.aula_backend02.model.Event;
import com.example.aula_backend02.model.Organizer;
import com.example.aula_backend02.service.EventService;
import com.example.aula_backend02.service.OrganizerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private OrganizerService organizerService;

    // Endpoint para buscar todos os eventos
    @PreAuthorize("hasRole('ADMIN') or hasRole('ORGANIZER') or hasRole('PARTICIPANT')")
    @GetMapping
    public ResponseEntity<?> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    // Endpoint para criar um evento
    @PreAuthorize("hasRole('ADMIN') or hasRole('ORGANIZER')")
    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Event event) {
        try {
            if (event.getOrganizer() == null || event.getOrganizer().getId() == null) {
                return ResponseEntity.badRequest().body("Organizador é obrigatório.");
            }

            Optional<Organizer> organizerOptional = organizerService.getOrganizerById(event.getOrganizer().getId());
            if (organizerOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Organizador não encontrado.");
            }

            event.setOrganizer(organizerOptional.get());
            Event savedEvent = eventService.saveEvent(event);
            return ResponseEntity.ok(savedEvent);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erro ao salvar evento.");
        }
    }

    // Endpoint para editar um evento existente
    @PreAuthorize("hasRole('ADMIN') or hasRole('ORGANIZER')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        try {
            Optional<Event> eventOptional = eventService.getEventById(id);
            if (eventOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Event eventToUpdate = eventOptional.get();
            eventToUpdate.setName(eventDetails.getName());
            eventToUpdate.setDate(eventDetails.getDate());
            eventToUpdate.setLocation(eventDetails.getLocation());
            eventToUpdate.setDescription(eventDetails.getDescription());

            // Verificar se o organizador foi enviado
            if (eventDetails.getOrganizer() != null && eventDetails.getOrganizer().getId() != null) {
                Optional<Organizer> organizerOptional = organizerService.getOrganizerById(eventDetails.getOrganizer().getId());
                if (organizerOptional.isPresent()) {
                    eventToUpdate.setOrganizer(organizerOptional.get());
                } else {
                    return ResponseEntity.badRequest().body("Organizador não encontrado.");
                }
            } else {
                eventToUpdate.setOrganizer(null); // Remove o organizador se não for enviado
            }

            Event updatedEvent = eventService.saveEvent(eventToUpdate);
            return ResponseEntity.ok(updatedEvent);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erro ao atualizar evento.");
        }
    }

    // Endpoint para deletar um evento
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException e) {
            // Retornando erro como JSON estruturado
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Não é possível excluir o evento, pois ele está associado a outros registros.");
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            // Retornando erro genérico como JSON estruturado
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Erro ao excluir o evento.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
