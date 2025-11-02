package com.example.accountservice.Dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransferRequestDto { //iki hesap arasında

    private String targetAccountNumber;
    private String sourceAccountNumber;
    private BigDecimal amount;
}
