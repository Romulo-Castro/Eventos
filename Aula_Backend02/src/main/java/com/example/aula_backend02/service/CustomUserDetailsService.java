package com.example.aula_backend02.service;

import com.example.aula_backend02.model.User;
import com.example.aula_backend02.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Busca o usuário pelo email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com o email: " + email));

        // Retorna o UserDetails
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail()) // Email como username
                .password(user.getPassword())
                .roles(user.getRole().toString())
                .build();
    }
}