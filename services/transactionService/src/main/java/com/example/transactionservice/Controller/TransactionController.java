package com.example.transactionservice.Controller;

import com.example.transactionservice.Dto.TransactionRequestDto;
import com.example.transactionservice.Dto.TransactionResponseDto;
import com.example.transactionservice.Model.TransactionModel;
import com.example.transactionservice.Service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}