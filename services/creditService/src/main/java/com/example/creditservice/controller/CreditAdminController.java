package com.example.creditservice.controller;

import com.example.creditservice.dto.CreditResponseDto;
import com.example.creditservice.service.CreditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/credits/admin")
public class CreditAdminController {

    @Autowired
    private CreditService creditService;

    @GetMapping("/pending")
    public ResponseEntity<List<CreditResponseDto>> getPendingCredits(
            @RequestHeader("X-User-ID") Long adminUserId) {

        try {
            System.out.println("📋 Bekleyen krediler istendi: adminId=" + adminUserId);

            List<CreditResponseDto> credits = creditService.getPendingCredits();

            System.out.println("✅ Bekleyen kredi sayısı: " + credits.size());

            return ResponseEntity.ok(credits);
        } catch (Exception e) {
            System.err.println("❌ Bekleyen krediler hatası: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/{creditId}/approve")
    public ResponseEntity<CreditResponseDto> approveCredit(
            @PathVariable Long creditId,
            @RequestHeader("X-User-ID") Long adminUserId) {  // ← Header'dan al

        try {
            CreditResponseDto response = creditService.approveCredit(creditId, adminUserId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PutMapping("/{creditId}/reject")
    public ResponseEntity<CreditResponseDto> rejectCredit(
            @PathVariable Long creditId,
            @RequestHeader("X-User-ID") Long adminUserId) {  // ← Header'dan al

        try {
            CreditResponseDto response = creditService.rejectCredit(creditId, adminUserId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<CreditResponseDto>> getAllCredits(
            @RequestHeader("X-User-ID") Long adminUserId) {  // ← Header'dan al

        List<CreditResponseDto> credits = creditService.getAllCredits();
        return ResponseEntity.ok(credits);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getCreditsByStatus(
            @PathVariable String status,
            @RequestHeader("X-User-ID") Long adminUserId) {  // ← Header'dan al

        try {
            List<CreditResponseDto> credits = creditService.getCreditsByStatus(status);
            return ResponseEntity.ok(credits);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Geçersiz kredi statüsü: " + status +
                            ". Geçerli değerler: PENDING, APPROVED, REJECTED, ACTIVE, PAID");
        }
    }
}