package com.example.accountservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class ResourceServerConfig {

    @Bean
    public SecurityFilterChain springSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                // csrf Korumasını kapat microservice yapısında genelde kapalı olur
                .csrf(csrf -> csrf.disable())

                // tüm api çağrılarının kimlik doğrulaması gerektirmesi
                .authorizeHttpRequests(authorize -> authorize
                        .anyRequest().authenticated()
                )

                //  OAuth2 Resource Server'ı etkinleştirir ve tokenı ootmatik olarak dogrular
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));
        return http.build();
    }
}
