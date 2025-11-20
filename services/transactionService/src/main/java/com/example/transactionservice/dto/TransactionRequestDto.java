package com.example.transactionservice.dto;

import com.example.transactionservice.model.TransactionStatus;
import com.example.transactionservice.model.TransactionType;
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

    @NotNull
    private Long userId;

    @NotNull
    private String sourceAccountNumber;

    @NotNull
    private String targetAccountNumber;

    @NotNull
    @Positive
    private BigDecimal amount;

    @Size(max = 500)
    private String description;

    @NotNull
    private TransactionType transactionType;

    @NotNull
    private TransactionStatus transactionStatus;

}
