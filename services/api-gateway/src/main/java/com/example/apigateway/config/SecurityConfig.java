package com.example.apigateway.config;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
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
import java.nio.charset.StandardCharsets;

@Configuration
@EnableWebFluxSecurity // Gateway reaktif (WebFlux) olduğu için bunu kullanırız
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {

        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)

                // KRİTİK: Yetkilendirme ayarlarını yapıyoruz
                .authorizeExchange(exchange -> exchange
                        .pathMatchers(HttpMethod.POST, "/api/users/register", "/api/users/login").permitAll()
                        .anyExchange().authenticated() // Diğer her şeyi kilitler
                );

        // KRİTİK DEĞİŞİKLİK: Bu blok, JWT doğrulamasını etkinleştirir
        http.oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        return http.build();
    }

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    @Bean
    public ReactiveJwtDecoder reactiveJwtDecoder() {

        // KRİTİK: Base64 çözümlemesini doğrudan byte dizisi olarak yapın
        // Bu, Spring Security'ye Base64 ile kodlanmış JWT'nin anahtarını veriyor.

        // NOT: User Service'te jjwt'nin kendi Decoders.BASE64.decode() metodunu kullanıyoruz.
        // API Gateway'de ise (Spring Security OAuth2) farklı bir yapılandırma gerekiyor.

        // 1. Secret Key'i doğrudan Base64'ten çözerek byte dizisine alıyoruz.
        // (Bunun için io.jsonwebtoken.io.Decoders.BASE64 kullanılıyorsa, onu kullanın)
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);

        // 2. SecretKey nesnesini oluşturma
        SecretKey secret = Keys.hmacShaKeyFor(keyBytes);

        // 3. Reaktif Decoder'ı oluşturma
        return NimbusReactiveJwtDecoder.withSecretKey(secret).build();
    }
}