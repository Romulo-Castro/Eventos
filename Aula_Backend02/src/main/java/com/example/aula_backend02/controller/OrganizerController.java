package com.example.aula_backend02.controller;

import com.example.aula_backend02.model.Organizer;
import com.example.aula_backend02.service.OrganizerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/organizers")
public class OrganizerController {

    private final OrganizerService organizerService;

    @Autowired
    public OrganizerController(OrganizerService organizerService) {
        this.organizerService = organizerService;
    }

    // Buscar todos os organizadores (ADMIN e ORGANIZER)
    @PreAuthorize("hasRole('ADMIN') or hasRole('ORGANIZER')")
    @GetMapping
    public List<Organizer> getAllOrganizers() {
        return organizerService.getAllOrganizers();
    }

    // Buscar um organizador por ID (ADMIN e ORGANIZER)
    @PreAuthorize("hasRole('ADMIN') or hasRole('ORGANIZER')")
    @GetMapping("/{id}")
    public ResponseEntity<Organizer> getOrganizerById(@PathVariable Long id) {
        Optional<Organizer> organizer = organizerService.getOrganizerById(id);
        return organizer.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Criar um novo organizador (apenas ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createOrganizer(@RequestBody Organizer organizer) {
        try {
            Organizer savedOrganizer = organizerService.saveOrganizer(organizer);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedOrganizer);
        } catch (DataIntegrityViolationException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Erro ao criar o organizador. Verifique os dados enviados.");
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Erro interno ao criar o organizador.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Atualizar um organizador existente (apenas ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrganizer(@PathVariable Long id, @RequestBody Organizer organizerDetails) {
        try {
            Optional<Organizer> organizer = organizerService.getOrganizerById(id);
            if (organizer.isPresent()) {
                Organizer organizerToUpdate = organizer.get();
                organizerToUpdate.setName(organizerDetails.getName());
                organizerToUpdate.setEmail(organizerDetails.getEmail());
                organizerToUpdate.setPhone(organizerDetails.getPhone());
                organizerToUpdate.setCompany(organizerDetails.getCompany());
                organizerToUpdate.setPosition(organizerDetails.getPosition());
                organizerToUpdate.setBio(organizerDetails.getBio());
                Organizer updatedOrganizer = organizerService.saveOrganizer(organizerToUpdate);
                return ResponseEntity.ok(updatedOrganizer);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Organizador não encontrado.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Erro ao atualizar o organizador.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Deletar um organizador por ID (apenas ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrganizer(@PathVariable Long id) {
        try {
            organizerService.deleteOrganizer(id);
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Não é possível excluir o organizador, pois ele está associado a eventos.");
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Erro ao excluir o organizador.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
