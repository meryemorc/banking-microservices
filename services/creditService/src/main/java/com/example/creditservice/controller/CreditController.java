package com.example.creditservice.controller;

import com.example.creditservice.dto.CreditApplicationDto;
import com.example.creditservice.dto.CreditResponseDto;
import com.example.creditservice.service.CreditService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/credits")
public class CreditController {

    @Autowired
    private CreditService creditService;

    /**
     * Kredi başvurusu yap
     * POST /credits/apply
     */
    @PostMapping("/apply")
    public ResponseEntity<CreditResponseDto> applyForCredit(
            @RequestHeader("X-User-ID") Long userId,
            @Valid @RequestBody CreditApplicationDto dto) {

        CreditResponseDto response = creditService.applyForCredit(userId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Kullanıcının tüm kredilerini listele
     * GET /credits/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CreditResponseDto>> getUserCredits(@PathVariable Long userId) {
        List<CreditResponseDto> credits = creditService.getUserCredits(userId);
        return ResponseEntity.ok(credits);
    }

    /**
     * Kredi detayını getir
     * GET /credits/{creditId}
     */
    @GetMapping("/{creditId}")
    public ResponseEntity<CreditResponseDto> getCreditById(@PathVariable Long creditId) {
        CreditResponseDto credit = creditService.getCreditById(creditId);
        return ResponseEntity.ok(credit);
    }

    /**
     * Kullanıcının aktif kredilerini listele
     * GET /credits/user/{userId}/active
     */
    @GetMapping("/user/{userId}/active")
    public ResponseEntity<List<CreditResponseDto>> getUserActiveCredits(@PathVariable Long userId) {
        List<CreditResponseDto> credits = creditService.getUserActiveCredits(userId);
        return ResponseEntity.ok(credits);
    }
}