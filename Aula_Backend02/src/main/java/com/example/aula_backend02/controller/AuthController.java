package com.example.aula_backend02.controller;

import com.example.aula_backend02.dto.LoginRequest;
import com.example.aula_backend02.model.Role;
import com.example.aula_backend02.model.User;
import com.example.aula_backend02.repository.UserRepository;
import com.example.aula_backend02.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Autentica o usuário com o email e a senha
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            // Busca o usuário do banco para recuperar as roles
            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

            // Gera o token com as roles reais do usuário
            List<String> roles = List.of("ROLE_" + user.getRole().toString());
            String token = jwtUtil.generateToken(loginRequest.getEmail(), roles);

            // Retorna o token no corpo da resposta
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Credenciais inválidas!");
        }
    }

    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        // Valida e configura o papel do usuário
        try {
            user.setRole(Role.valueOf(user.getRole().toString().toUpperCase())); // Converte para enum Role
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Papel inválido! Use ADMIN, ORGANIZER ou PARTICIPANT.");
        }
    
        // Criptografa a senha antes de salvar
        user.setPassword(passwordEncoder.encode(user.getPassword()));
    
        // Salva o usuário no banco
        userRepository.save(user);
    
        return "Usuário cadastrado com sucesso!";
    }

    @GetMapping("/user-info")
    @PreAuthorize("isAuthenticated()") // Apenas usuários autenticados
    public ResponseEntity<?> getUserInfo(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado.");
        }

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("name", userDetails.getUsername());
        userInfo.put("roles", userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList()));

        return ResponseEntity.ok(userInfo);
    }
}
