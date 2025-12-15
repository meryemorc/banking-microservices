package com.example.creditservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "credits")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Credit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal requestedAmount;

    @Column(precision = 15, scale = 2)
    private BigDecimal approvedAmount;

    @Column(nullable = false)
    private Integer installments;  // Taksit sayısı

    @Column(precision = 15, scale = 2)
    private BigDecimal monthlyPayment;

    @Column(precision = 5, scale = 2)
    private BigDecimal interestRate;  // Faiz oranı

    private Integer creditScore;  // 0-1000 arası

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CreditStatus status;  // PENDING, APPROVED, REJECTED, ACTIVE, PAID

    @Enumerated(EnumType.STRING)
    private CreditPurpose purpose;  // EV_TADILATI, ARAC, EGITIM, vb.

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime approvedAt;

    private Long approvedBy;  // Admin user ID

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = CreditStatus.PENDING;
        }
    }
}

