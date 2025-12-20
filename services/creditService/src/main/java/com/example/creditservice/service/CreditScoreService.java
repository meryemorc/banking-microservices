package com.example.creditservice.service;

import org.springframework.stereotype.Service;

@Service
public class CreditScoreService {

    public int calculateCreditScore(Long userId) {
        System.out.println("🔍 Kredi skoru hesaplanıyor (basitleştirilmiş): userId=" + userId);

        // Geçici: Her zaman 750 döndür (test için)
        // Gerçek implementasyon sonra yapılacak
        int score = 750;

        System.out.println("⭐ Kredi skoru: " + score);

        return score;
    }
}