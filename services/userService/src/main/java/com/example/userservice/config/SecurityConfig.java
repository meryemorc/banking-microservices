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

@Configuration
@EnableWebSecurity //spring securıtyı aktif eder
public class SecurityConfig {

    @Bean //tnaımlanaacak filtreleri belirler
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CORS ve CSRF devre dışı bırakılır
                .csrf(AbstractHttpConfigurer::disable) //keycloak kullandıgımız icin oturum tutmuyotuz stateless bu nedenle csrf gereksiz karmasıklık
                .cors(AbstractHttpConfigurer::disable) //geliştirme kolaylıgı icin reactın ba ke kolay istek atmasını sagladık
                .authorizeHttpRequests(auth -> auth //authorization kuralı blogu olusturur
                        // Kayıt ve Giriş yolları herkes için erişilebilir olmalı
                        .requestMatchers("/user/register", "/user/login").permitAll()
                        // Eureka Discovery için gerekli yollar
                        .requestMatchers("/eureka/**").permitAll()
                        // Diğer tüm istekler kimlik doğrulaması gerektirmeli
                        .anyRequest().authenticated()
                );

        return http.build(); //butun filterları tek bir guvenlik kuralalrını birleştirmeye ve uygulamaya hazır bir güvenlik zincirine(SecurityFİlterChaın) cevirmeyi inşa eder
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