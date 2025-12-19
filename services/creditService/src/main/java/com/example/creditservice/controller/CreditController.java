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

    @PostMapping("/apply")
    public ResponseEntity<CreditResponseDto> applyForCredit(
            @RequestHeader("X-User-ID") Long userId,  // ← API Gateway'den geliyor!
            @Valid @RequestBody CreditApplicationDto dto) {

        CreditResponseDto response = creditService.applyForCredit(userId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CreditResponseDto>> getUserCredits(
            @PathVariable Long userId,
            @RequestHeader("X-User-ID") Long authenticatedUserId) {

        if (!authenticatedUserId.equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        List<CreditResponseDto> credits = creditService.getUserCredits(userId);
        return ResponseEntity.ok(credits);
    }

    @GetMapping("/{creditId}")
    public ResponseEntity<CreditResponseDto> getCreditById(
            @PathVariable Long creditId,
            @RequestHeader("X-User-ID") Long userId) {

        CreditResponseDto credit = creditService.getCreditById(creditId);

        if (!credit.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        return ResponseEntity.ok(credit);
    }

    @GetMapping("/user/{userId}/active")
    public ResponseEntity<List<CreditResponseDto>> getUserActiveCredits(
            @PathVariable Long userId,
            @RequestHeader("X-User-ID") Long authenticatedUserId) {

        if (!authenticatedUserId.equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        List<CreditResponseDto> credits = creditService.getUserActiveCredits(userId);
        return ResponseEntity.ok(credits);
    }
}