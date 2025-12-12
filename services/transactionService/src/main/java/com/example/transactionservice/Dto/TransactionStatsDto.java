package com.example.transactionservice.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionStatsDto {
    private Long totalTransactions;
    private BigDecimal totalAmount;
    private Long successCount;
    private Long failedCount;
    private BigDecimal averageAmount;
}

