package com.example.creditservice.dto;

import com.example.creditservice.model.CreditPurpose;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditApplicationDto {

    @NotNull(message = "Kredi tutarı boş olamaz")
    @DecimalMin(value = "1000.00", message = "Minimum kredi tutarı 1000 TL")
    @DecimalMax(value = "500000.00", message = "Maximum kredi tutarı 500000 TL")
    private BigDecimal requestedAmount;

    @NotNull(message = "Taksit sayısı boş olamaz")
    @Min(value = 3, message = "Minimum 3 taksit")
    @Max(value = 36, message = "Maximum 36 taksit")
    private Integer installments;

    @NotNull(message = "Kredi amacı belirtilmeli")
    private CreditPurpose purpose;
}
