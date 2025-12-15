package com.example.creditservice.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.math.BigDecimal;

@Service
public class CreditScoreService {

    // Basit kredi skoru algoritması
    public int calculateCreditScore(Long userId) {
        int score = 0;

        // 1. Hesap bakiyesini kontrol et (Account Service'ten çek)
        // TODO: Feign Client ile Account Service'e request at
        BigDecimal balance = getAccountBalance(userId);

        if (balance.compareTo(new BigDecimal("50000")) > 0) {
            score += 300;
        } else if (balance.compareTo(new BigDecimal("20000")) > 0) {
            score += 200;
        } else if (balance.compareTo(new BigDecimal("5000")) > 0) {
            score += 100;
        } else {
            score += 50;
        }

        // 2. Transaction sayısını kontrol et (Transaction Service'ten çek)
        // TODO: Feign Client ile Transaction Service'e request at
        int transactionCount = getTransactionCount(userId);

        if (transactionCount > 50) {
            score += 200;
        } else if (transactionCount > 20) {
            score += 100;
        } else if (transactionCount > 10) {
            score += 50;
        }

        // 3. Rastgele faktör (yaş, gelir vb. simüle et)
        score += (int) (Math.random() * 200);

        // Skor 0-1000 arası
        return Math.min(score, 1000);
    }

    // Simüle edilmiş metod (gerçekte Feign Client kullanılacak)
    private BigDecimal getAccountBalance(Long userId) {
        // TODO: Account Service'ten gerçek veri çek
        // Şimdilik simüle edelim
        return new BigDecimal((int) (Math.random() * 100000));
    }

    // Simüle edilmiş metod (gerçekte Feign Client kullanılacak)
    private int getTransactionCount(Long userId) {
        // TODO: Transaction Service'ten gerçek veri çek
        // Şimdilik simüle edelim
        return (int) (Math.random() * 100);
    }
}