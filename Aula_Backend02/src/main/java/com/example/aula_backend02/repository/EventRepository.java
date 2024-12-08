package com.example.aula_backend02.repository;

import com.example.aula_backend02.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    // Método para encontrar eventos pelo nome
    List<Event> findByNameContaining(String name);
}
