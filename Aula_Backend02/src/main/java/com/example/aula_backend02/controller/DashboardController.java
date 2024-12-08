package com.example.aula_backend02.controller;

import com.example.aula_backend02.model.Event;
import com.example.aula_backend02.model.Organizer;
import com.example.aula_backend02.model.Participant;
import com.example.aula_backend02.service.EventService;
import com.example.aula_backend02.service.OrganizerService;
import com.example.aula_backend02.service.ParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final EventService eventService;
    private final ParticipantService participantService;
    private final OrganizerService organizerService;

    @Autowired
    public DashboardController(EventService eventService, ParticipantService participantService, OrganizerService organizerService) {
        this.eventService = eventService;
        this.participantService = participantService;
        this.organizerService = organizerService;
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('ORGANIZER') or hasRole('PARTICIPANT')")
    @GetMapping("/totals")
    public Map<String, Long> getTotals() {
        long totalEvents = eventService.getAllEvents().size();
        long totalParticipants = participantService.getAllParticipants().size();
        long totalOrganizers = organizerService.getAllOrganizers().size();
        Map<String, Long> totals = new HashMap<>();
        totals.put("totalEvents", totalEvents);
        totals.put("totalParticipants", totalParticipants);
        totals.put("totalOrganizers", totalOrganizers);
        return totals;
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('ORGANIZER') or hasRole('PARTICIPANT')")
    @GetMapping("/monthly-totals")
    public ResponseEntity<Map<String, Map<String, Long>>> getMonthlyTotals() {
        Map<String, Map<String, Long>> monthlyData = new HashMap<>();
        int currentYear = LocalDate.now().getYear();

        try {
            // Puxar os eventos e contar por mês
            List<Event> events = eventService.getAllEvents();
            for (Event event : events) {
                if (event.getDate() != null && event.getDate().getYear() == currentYear) {
                    String month = event.getDate().getMonth().toString();
                    monthlyData.putIfAbsent(month, new HashMap<>());
                    monthlyData.get(month).put("events", monthlyData.get(month).getOrDefault("events", 0L) + 1);
                }
            }

            // Puxar os organizadores e contar por mês
            List<Organizer> organizers = organizerService.getAllOrganizers();
            for (Organizer organizer : organizers) {
                if (organizer.getCreatedAt() != null && organizer.getCreatedAt().getYear() == currentYear) {
                    String month = organizer.getCreatedAt().getMonth().toString();
                    monthlyData.putIfAbsent(month, new HashMap<>());
                    monthlyData.get(month).put("organizers", monthlyData.get(month).getOrDefault("organizers", 0L) + 1);
                }
            }

            // Puxar os participantes e contar por evento
            List<Participant> participants = participantService.getAllParticipants();
            for (Participant participant : participants) {
                if (participant.getEvent() != null && participant.getEvent().getDate().getYear() == currentYear) {
                    String month = participant.getEvent().getDate().getMonth().toString();
                    monthlyData.putIfAbsent(month, new HashMap<>());
                    monthlyData.get(month).put("participants", monthlyData.get(month).getOrDefault("participants", 0L) + 1);
                }
            }

            // Garantir que todos os meses estão presentes, mesmo os meses sem dados
            List<String> months = List.of(
                "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
                "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
            );

            for (String month : months) {
                monthlyData.putIfAbsent(month, new HashMap<>());
                monthlyData.get(month).putIfAbsent("events", 0L);
                monthlyData.get(month).putIfAbsent("organizers", 0L);
                monthlyData.get(month).putIfAbsent("participants", 0L);
            }

            return ResponseEntity.ok(monthlyData);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null); // Erro interno do servidor
        }
    }
}
