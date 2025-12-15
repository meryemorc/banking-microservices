package com.example.creditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditApprovalMessageDto { //rabbitmq icin

    private Long creditId;
    private Long userId;
    private String accountNumber;
    private BigDecimal amount;
    private String description;
}