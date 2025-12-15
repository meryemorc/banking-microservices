package com.example.creditservice.controller;

import com.example.creditservice.dto.CreditResponseDto;
import com.example.creditservice.service.CreditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/credits/admin")
public class CreditAdminController {

    @Autowired
    private CreditService creditService;

    /**
     * Bekleyen kredi başvurularını listele
     * GET /credits/admin/pending
     */
    @GetMapping("/pending")
    public ResponseEntity<List<CreditResponseDto>> getPendingCredits() {
        List<CreditResponseDto> credits = creditService.getPendingCredits();
        return ResponseEntity.ok(credits);
    }

    /**
     * Kredi başvurusunu onayla
     * PUT /credits/admin/{creditId}/approve
     */
    @PutMapping("/{creditId}/approve")
    public ResponseEntity<CreditResponseDto> approveCredit(
            @PathVariable Long creditId,
            @RequestHeader("X-User-ID") Long adminUserId) {

        CreditResponseDto response = creditService.approveCredit(creditId, adminUserId);
        return ResponseEntity.ok(response);
    }

    /**
     * Kredi başvurusunu reddet
     * PUT /credits/admin/{creditId}/reject
     */
    @PutMapping("/{creditId}/reject")
    public ResponseEntity<CreditResponseDto> rejectCredit(
            @PathVariable Long creditId,
            @RequestHeader("X-User-ID") Long adminUserId) {

        CreditResponseDto response = creditService.rejectCredit(creditId, adminUserId);
        return ResponseEntity.ok(response);
    }

    /**
     * Tüm kredileri listele (Admin)
     * GET /credits/admin/all
     */
    @GetMapping("/all")
    public ResponseEntity<List<CreditResponseDto>> getAllCredits() {
        List<CreditResponseDto> credits = creditService.getAllCredits();
        return ResponseEntity.ok(credits);
    }

    /**
     * Belirli bir statüdeki kredileri listele
     * GET /credits/admin/status/{status}
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<CreditResponseDto>> getCreditsByStatus(@PathVariable String status) {
        List<CreditResponseDto> credits = creditService.getCreditsByStatus(status);
        return ResponseEntity.ok(credits);
    }
}