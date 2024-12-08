package com.example.aula_backend02.service;

import com.example.aula_backend02.dto.RegisterRequest;
import com.example.aula_backend02.model.Role;
import com.example.aula_backend02.model.User;
import com.example.aula_backend02.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User saveUser(RegisterRequest registerRequest) {
        User user = new User();

        // Definir campos básicos
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        // Converter o papel (role) de string para o enum
        try {
            Role roleEnum = Role.valueOf(registerRequest.getRole().toUpperCase()); // Converte para enum
            user.setRole(roleEnum);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Role inválido fornecido: " + registerRequest.getRole());
        }

        return userRepository.save(user);
    }

    public boolean validatePassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
