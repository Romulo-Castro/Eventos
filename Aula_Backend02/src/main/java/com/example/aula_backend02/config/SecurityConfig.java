package com.example.aula_backend02.config;

import com.example.aula_backend02.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(CustomUserDetailsService userDetailsService, JwtAuthFilter jwtAuthFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Desativa proteção CSRF para simplificar testes
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Configura CORS
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/register", "/auth/login").permitAll() // Permite acesso público
                .requestMatchers(HttpMethod.GET, "/api/dashboard/**").hasAnyRole("ADMIN", "ORGANIZER", "PARTICIPANT") // Somente ADMIN pode visualizar dashboard
                .requestMatchers(HttpMethod.GET, "/api/events/**").hasAnyRole("ADMIN", "ORGANIZER", "PARTICIPANT") // PARTICIPANT pode visualizar eventos
                .requestMatchers(HttpMethod.POST, "/api/events/**").hasAnyRole("ADMIN", "ORGANIZER") // Apenas ADMIN e ORGANIZER podem criar eventos
                .requestMatchers(HttpMethod.PUT, "/api/events/**").hasAnyRole("ADMIN", "ORGANIZER") // Apenas ADMIN e ORGANIZER podem editar eventos
                .requestMatchers(HttpMethod.DELETE, "/api/events/**").hasRole("ADMIN") // Apenas ADMIN pode excluir eventos
                .requestMatchers(HttpMethod.GET, "/api/organizers/**").hasAnyRole("ADMIN", "ORGANIZER") // ADMIN e ORGANIZER podem visualizar organizadores
                .requestMatchers(HttpMethod.POST, "/api/organizers/**").hasRole("ADMIN") // Apenas ADMIN pode criar organizadores
                .requestMatchers(HttpMethod.PUT, "/api/organizers/**").hasRole("ADMIN") // Apenas ADMIN pode editar organizadores
                .requestMatchers(HttpMethod.DELETE, "/api/organizers/**").hasRole("ADMIN") // Apenas ADMIN pode excluir organizadores
                .requestMatchers(HttpMethod.GET, "/api/participants/**").hasAnyRole("ADMIN", "ORGANIZER") // PARTICIPANT pode visualizar informações
                .requestMatchers(HttpMethod.POST, "/api/participants/**").hasAnyRole("ADMIN", "ORGANIZER") // Apenas ADMIN e ORGANIZER podem adicionar participantes
                .requestMatchers(HttpMethod.PUT, "/api/participants/**").hasAnyRole("ADMIN", "ORGANIZER") // Apenas ADMIN e ORGANIZER podem editar participantes
                .requestMatchers(HttpMethod.DELETE, "/api/participants/**").hasRole("ADMIN") // Apenas ADMIN pode excluir participantes
                .anyRequest().authenticated() // Requer autenticação para os demais endpoints
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); // Adiciona filtro JWT

        return http.build();
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // Origem permitida
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Métodos permitidos
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type")); // Cabeçalhos permitidos
        configuration.setExposedHeaders(List.of("Authorization")); // Cabeçalhos expostos
        configuration.setAllowCredentials(true); // Permite cookies/credenciais

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
