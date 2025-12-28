package com.example.apigateway.config;

import com.example.apigateway.filter.AuthHeaderFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.web.server.SecurityWebFilterChain;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    private final AuthHeaderFilter authHeaderFilter;

    @Value("${spring.security.oauth2.resourceserver.jwt.secret-key}")
    private String secretKeyString;

    public SecurityConfig(AuthHeaderFilter authHeaderFilter) {
        this.authHeaderFilter = authHeaderFilter;
    }

    @Bean
    public ReactiveJwtDecoder jwtDecoder() {
        byte[] decodedKey = Base64.getDecoder().decode(secretKeyString);
        SecretKey key = new SecretKeySpec(decodedKey, "HmacSHA256");
        return NimbusReactiveJwtDecoder.withSecretKey(key).build();
    }

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()))
                .authorizeExchange(exchange -> exchange
                        .pathMatchers(HttpMethod.POST, "/users/register", "/users/login").permitAll()
                        .pathMatchers("/eureka/**").permitAll()
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        return http.build();
    }
}