package com.example.userservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity //spring securıtyı aktif eder
public class SecurityConfig {


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(AbstractHttpConfigurer::disable)
                // ... (csrf, cors ayarları)
                .authorizeHttpRequests(auth -> auth

                        // KRİTİK: POST metodu için /register ve /login yollarını açın
                        .requestMatchers(HttpMethod.POST, "/user/register", "/user/login").permitAll()

                        // KRİTİK: GET metodu için de /exists/ gibi yolları açın
                        .requestMatchers(HttpMethod.GET, "/user/exists/**").permitAll()

                        // Eureka yolları
                        .requestMatchers("/eureka/**").permitAll()

                        // Kalan tüm istekler kimlik doğrulaması gerektirsin (EN SONDA OLMALI)
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    // Şifreleri şifrelemek için gerekli olan PasswordEncoder Bean'i
    @Bean
    public PasswordEncoder passwordEncoder() {//password encoder beanı nesnesi oluşturuldu tanımlandı
        return new BCryptPasswordEncoder(); //passwordencoder sifreleri hashlemeye yarar
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}