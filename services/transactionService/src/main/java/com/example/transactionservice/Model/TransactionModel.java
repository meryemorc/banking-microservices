package com.example.transactionservice.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "transactions")
public class TransactionModel {

    @Id  // ← Sadece bir tane!
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)  // ← @Id YOK!
    private Long userId;

    @Column(nullable = false, precision = 19, scale = 2)  // ← Para için precision
    private BigDecimal amount;

    @Column(nullable = false)
    private String sourceAccountNumber;

    @Column(nullable = false)
    private String targetAccountNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)  // ← 200 değil 20 yeter
    private TransactionType transactionType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionStatus transactionStatus;

    @Column(length = 500)
    private String description;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
