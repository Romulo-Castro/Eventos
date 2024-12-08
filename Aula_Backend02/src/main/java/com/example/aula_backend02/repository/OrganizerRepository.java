package com.example.aula_backend02.repository;

import com.example.aula_backend02.model.Organizer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizerRepository extends JpaRepository<Organizer, Long> {
    // Métodos adicionais podem ser definidos aqui, se necessário
    // Exemplo: Buscar organizador por email
    Organizer findByEmail(String email);
}
