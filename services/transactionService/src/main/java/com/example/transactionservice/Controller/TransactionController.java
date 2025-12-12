package com.example.transactionservice.Controller;

import com.example.transactionservice.Dto.TransactionRequestDto;
import com.example.transactionservice.Dto.TransactionResponseDto;
import com.example.transactionservice.Dto.TransactionStatsDto;
import com.example.transactionservice.Model.TransactionModel;
import com.example.transactionservice.Model.TransactionStatus;
import com.example.transactionservice.Model.TransactionType;
import com.example.transactionservice.Service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/transaction")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/create")
    public ResponseEntity<TransactionResponseDto> createTransaction(
            @RequestBody @Valid TransactionRequestDto request
    ) {
        TransactionResponseDto response = transactionService.createTransaction(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/user")
    public ResponseEntity<List<TransactionModel>> getUserTransactions(
            @RequestHeader("X-User-ID") Long userId
    ) {
        List<TransactionModel> transactions = transactionService.getUserTransactions(userId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/source/{accountNumber}")
    public ResponseEntity<List<TransactionModel>> getSourceAccountTransactions(
            @PathVariable String accountNumber
    ) {
        List<TransactionModel> transactions = transactionService.findBySourceAccountNumber(accountNumber);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/target/{accountNumber}")
    public ResponseEntity<List<TransactionModel>> getTargetAccountTransactions(
            @PathVariable String accountNumber
    ) {
        List<TransactionModel> transactions = transactionService.findByTargetAccountNumber(accountNumber);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<TransactionModel>> getRecentTransactions(
            @RequestHeader("X-User-ID") Long userId
    ) {
        List<TransactionModel> transactions = transactionService.findTop10ByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<TransactionModel>> getUserTransactionsPaginated(
            @RequestHeader("X-User-ID") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<TransactionModel> transactions = transactionService.findByUserId(userId, PageRequest.of(page, size));
        return ResponseEntity.ok(transactions);
    }
    @GetMapping("/filter")
    public ResponseEntity<List<TransactionModel>> filterByDateRange(
            @RequestHeader("X-User-ID") Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ResponseEntity.ok(transactionService.filterByDateRange(userId, startDate, endDate));
    }
    @GetMapping("/status/{status}")
    public ResponseEntity<List<TransactionModel>> filterByStatus(
            @RequestHeader("X-User-ID") Long userId,
            @PathVariable TransactionStatus status
    ) {
        return ResponseEntity.ok(transactionService.filterByStatus(userId, status));
    }
    @GetMapping("/type/{type}")
    public ResponseEntity<List<TransactionModel>> filterByType(
            @RequestHeader("X-User-ID") Long userId,
            @PathVariable TransactionType type
    ) {
        return ResponseEntity.ok(transactionService.filterByType(userId, type));
    }
    @GetMapping("/stats")
    public ResponseEntity<TransactionStatsDto> getUserStats(
            @RequestHeader("X-User-ID") Long userId
    ) {
        return ResponseEntity.ok(transactionService.getUserStats(userId));
    }
}