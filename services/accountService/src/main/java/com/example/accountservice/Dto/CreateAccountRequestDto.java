package com.example.accountservice.Dto;

import com.example.accountservice.Model.AccountType;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAccountRequestDto {

    private Long userId;
    private AccountType accountType;
    @Min(value = 0)
    private BigDecimal initialBalance;
}
