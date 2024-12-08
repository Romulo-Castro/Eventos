package com.example.aula_backend02.service;

import com.example.aula_backend02.model.Organizer;
import com.example.aula_backend02.repository.OrganizerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrganizerService {

    private final OrganizerRepository organizerRepository;


    @Autowired
    private EventService eventService;
    public OrganizerService(OrganizerRepository organizerRepository) {
        this.organizerRepository = organizerRepository;
    }

    public boolean isOrganizerLinkedToEvents(Long organizerId) {
        return eventService.getAllEvents().stream()
            .anyMatch(event -> event.getOrganizer() != null && event.getOrganizer().getId().equals(organizerId));
    }

    public List<Organizer> getAllOrganizers() {
        return organizerRepository.findAll();
    }

    public Optional<Organizer> getOrganizerById(Long id) {
        return organizerRepository.findById(id);
    }

    public Organizer saveOrganizer(Organizer organizer) {
        return organizerRepository.save(organizer);
    }

    public void deleteOrganizer(Long id) {
        organizerRepository.deleteById(id);
    }

    public Optional<Organizer> updateOrganizer(Long id, Organizer organizerDetails) {
        Optional<Organizer> organizer = organizerRepository.findById(id);
        if (organizer.isPresent()) {
            Organizer existingOrganizer = organizer.get();
            existingOrganizer.setName(organizerDetails.getName());
            existingOrganizer.setEmail(organizerDetails.getEmail());
            existingOrganizer.setPhone(organizerDetails.getPhone());
            existingOrganizer.setCompany(organizerDetails.getCompany());
            existingOrganizer.setPosition(organizerDetails.getPosition());
            existingOrganizer.setBio(organizerDetails.getBio());
            organizerRepository.save(existingOrganizer);
            return Optional.of(existingOrganizer);
        }
        return Optional.empty();
    }
}
