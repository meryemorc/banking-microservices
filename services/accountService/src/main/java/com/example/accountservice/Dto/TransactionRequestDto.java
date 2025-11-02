package com.example.accountservice.Dto;

import com.example.accountservice.Model.TransactionType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequestDto { //tek hesaptaki işlemler


    private TransactionType transactionType;  // DEPOSIT veya WITHDRAW

    private BigDecimal amount;
}
