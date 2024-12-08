package com.example.aula_backend02.repository;

import com.example.aula_backend02.model.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    
    @Query("SELECT COUNT(p) FROM Participant p WHERE p.event.id = :eventId")
    int countByEventId(@Param("eventId") Long eventId);
}
