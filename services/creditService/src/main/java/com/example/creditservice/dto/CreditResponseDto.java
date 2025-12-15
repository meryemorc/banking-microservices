package com.example.creditservice.dto;

import com.example.creditservice.model.CreditPurpose;
import com.example.creditservice.model.CreditStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditResponseDto {

    private Long id;
    private Long userId;
    private BigDecimal requestedAmount;
    private BigDecimal approvedAmount;
    private Integer installments;
    private BigDecimal monthlyPayment;
    private BigDecimal interestRate;
    private Integer creditScore;
    private CreditStatus status;
    private CreditPurpose purpose;
    private LocalDateTime createdAt;
    private LocalDateTime approvedAt;
}
