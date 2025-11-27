package com.example.transactionservice.Dto;

import com.example.transactionservice.Model.TransactionStatus;
import com.example.transactionservice.Model.TransactionType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequestDto {

    @NotNull(message = "User ID null olamaz")
    private Long userId;

    @NotNull(message = "Source account number null olamaz")
    private String sourceAccountNumber;

    @NotNull(message = "Target account number null olamaz")
    private String targetAccountNumber;

    @Positive(message = "tutar pozitif olmalı")
    private BigDecimal amount;

    private TransactionType transactionType;

    private TransactionStatus transactionStatus;

    @Size(max = 500)
    private String description;
}
