package com.example.accountservice.Dto;


import com.example.accountservice.Model.AccountType;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponseDto {
    private Long id;
    private String accountNumber;

    @Min(value =0)
    private BigDecimal balance;
    private AccountType accountType;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
