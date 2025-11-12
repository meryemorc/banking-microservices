
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

    // application.yml'den secret-key'i okuyoruz
    @Value("${spring.security.oauth2.resourceserver.jwt.secret-key}")
    private String secretKeyString;

    public SecurityConfig(AuthHeaderFilter authHeaderFilter) {
        this.authHeaderFilter = authHeaderFilter;
    }

    // ⭐ KRİTİK: Bu bean eksikti!
    @Bean
    public ReactiveJwtDecoder jwtDecoder() {
        // Base64 formatındaki secret key'i decode ediyoruz
        byte[] decodedKey = Base64.getDecoder().decode(secretKeyString);

        // SecretKey nesnesi oluşturuyoruz (HMAC-SHA256 algoritması ile)
        SecretKey key = new SecretKeySpec(decodedKey, "HmacSHA256");

        // NimbusReactiveJwtDecoder ile JWT doğrulama yapacağız
        return NimbusReactiveJwtDecoder.withSecretKey(key).build();
    }

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()))

                .authorizeExchange(exchange -> exchange
                        .pathMatchers(HttpMethod.POST, "/api/users/register", "/api/users/login").permitAll()
                        .pathMatchers("/eureka/**").permitAll()
                        .anyExchange().authenticated()
                )

                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        return http.build();
    }
}