package com.example.apigateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter; // GlobalFilter arayüzü
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

        // 1. Güvenlik Kontekstini Çekme: Token'ın doğrulanıp doğrulanmadığını kontrol eder.
        return ReactiveSecurityContextHolder.getContext()
                .map(securityContext -> {
                    // Konteksten Authentication nesnesini al
                    Authentication authentication = securityContext.getAuthentication();

                    // 2. Token Kontrolü: Doğrulanmış bir JWT var mı?
                    if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
                        Jwt jwt = (Jwt) authentication.getPrincipal();

                        // 3. Token'dan "userId" claim'ini çekme (Kritik Bilgi)
                        String userId = jwt.getClaimAsString("userId");

                        if (userId != null) {
                            // 4. İsteği değiştirme (Mutable Request)
                            return exchange.mutate()
                                    // KRİTİK: Güvenli başlık (Header) olarak userId'yi diğer servislere iletiyoruz.
                                    .request(builder -> builder.header("X-User-ID", userId))
                                    .build();
                        }
                    }
                    // Token yoksa veya geçerli değilse/işlenemediyse, orijinal isteği döndür.
                    // (401 hatası zaten Security Config tarafından fırlatılacaktır.)
                    return exchange;
                })
                .defaultIfEmpty(exchange)
                .flatMap(chain::filter); // Değiştirilmiş isteği zincire (hedef servise) devam ettir
    }
}