package com.example.aula_backend02.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.lang.NonNull;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/**")  // Permite todas as rotas do backend
                        .allowedOrigins("http://localhost:3000")  // URL do frontend
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")  // Métodos HTTP permitidos
                        .allowedHeaders("Authorization", "Content-Type", "Accept", "X-Requested-With")  // Cabeçalhos permitidos
                        .exposedHeaders("Authorization")  // Cabeçalhos visíveis na resposta
                        .allowCredentials(true)  // Permite credenciais/cookies
                        .maxAge(3600);  // Cache do preflight (em segundos)
            }
        };
    }
}
