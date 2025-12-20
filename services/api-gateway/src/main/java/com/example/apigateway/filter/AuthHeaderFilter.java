package com.example.apigateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class AuthHeaderFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();
        String method = exchange.getRequest().getMethod().name();

        System.out.println("🌐 Gateway: " + method + " " + path);

        // Public endpoint'ler
        if (path.contains("/users/register") || path.contains("/users/login")) {
            System.out.println("✅ Public endpoint, direkt geçiyor");
            return chain.filter(exchange);
        }

        return ReactiveSecurityContextHolder.getContext()
                .flatMap(securityContext -> {
                    Authentication authentication = securityContext.getAuthentication();

                    if (authentication == null || !(authentication.getPrincipal() instanceof Jwt)) {
                        System.out.println("❌ Authentication null veya Jwt değil!");
                        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                        return exchange.getResponse().setComplete();
                    }

                    Jwt jwt = (Jwt) authentication.getPrincipal();
                    Long userId = jwt.getClaim("userId");
                    String role = jwt.getClaim("role");

                    System.out.println("👤 UserId: " + userId + ", Role: " + role);

                    if (userId == null) {
                        System.out.println("❌ UserId null!");
                        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                        return exchange.getResponse().setComplete();
                    }

                    // ADMIN kontrolü
                    if (path.contains("/admin")) {
                        if (!"ADMIN".equals(role)) {
                            System.out.println("❌ Admin yetkisi gerekli! (role: " + role + ")");
                            exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                            return exchange.getResponse().setComplete();
                        }
                    }

                    // Header'ları ekle
                    ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                            .header("X-User-ID", userId.toString())
                            .header("X-User-Role", role != null ? role : "USER")
                            .build();

                    System.out.println("✅ Header eklendi, servise yönlendiriliyor...");

                    // İsteği devam ettir
                    return chain.filter(exchange.mutate().request(modifiedRequest).build());
                })
                .onErrorResume(e -> {
                    System.err.println("❌ Filter hatası: " + e.getMessage());
                    e.printStackTrace();
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                });
    }

    @Override
    public int getOrder() {
        return -1;
    }
}