package com.example.creditservice.model;

public enum CreditStatus {
    PENDING,    // Beklemede
    APPROVED,   // Onaylandı
    REJECTED,   // Reddedildi
    ACTIVE,     // Aktif (para yatırıldı)
    PAID        // Ödendi
}
