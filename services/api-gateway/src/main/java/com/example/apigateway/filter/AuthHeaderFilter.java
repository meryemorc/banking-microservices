package com.example.apigateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class AuthHeaderFilter implements GlobalFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();

        // Public endpoint'ler (token kontrolü yok)
        if (path.contains("/users/register") || path.contains("/users/login")) {
            return chain.filter(exchange);
        }

        return ReactiveSecurityContextHolder.getContext()
                .map(securityContext -> {
                    Authentication authentication = securityContext.getAuthentication();

                    if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
                        Jwt jwt = (Jwt) authentication.getPrincipal();

                        Long userId = jwt.getClaim("userId");
                        String role = jwt.getClaim("role");  // ← YENİ: Role al

                        // ✅ ADMIN KONTROLÜ
                        if (path.contains("/admin")) {
                            if (role == null || !"ADMIN".equals(role)) {
                                // 403 Forbidden döndür
                                exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                                return exchange;
                            }
                        }

                        if (userId != null) {
                            return exchange.mutate()
                                    .request(builder -> {
                                        builder.header("X-User-ID", userId.toString());
                                        if (role != null) {
                                            builder.header("X-User-Role", role);  // ← YENİ: Role header ekle
                                        }
                                    })
                                    .build();
                        }
                    }
                    return exchange;
                })
                .defaultIfEmpty(exchange)
                .flatMap(modifiedExchange -> {
                    // Eğer response zaten set edildiyse (403 gibi), chain'e gitme
                    if (modifiedExchange.getResponse().getStatusCode() != null) {
                        return modifiedExchange.getResponse().setComplete();
                    }
                    return chain.filter(modifiedExchange);
                });
    }
}