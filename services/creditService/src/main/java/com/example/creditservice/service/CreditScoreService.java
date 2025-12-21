package com.example.creditservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;

@Service
    public class CreditScoreService {

        @Autowired
        private RestTemplate restTemplate;

    public int calculateCreditScore(Long userId) {
        System.out.println("🔍 Kredi skoru hesaplanıyor: userId=" + userId);

        int score = 550;

        System.out.println("⭐ Kredi skoru: " + score);

        return score;
    }
    }