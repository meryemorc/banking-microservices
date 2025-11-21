package com.example.transactionservice.controller;

import com.example.transactionservice.dto.TransactionRequestDto;
import com.example.transactionservice.model.TransactionModel;
import com.example.transactionservice.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/transaction")
public class TransactionController {
    private final TransactionService transactionService;

    @PostMapping("/create")
    public ResponseEntity<TransactionModel> createTransaction(@RequestBody @Valid TransactionRequestDto transactionRequestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.createTransaction(transactionRequestDto));
    }

     @GetMapping("/all")
    public ResponseEntity<List<TransactionModel>> getAllTransactions(@RequestHeader("X-USER-ID")Long userId ){
        return ResponseEntity.status(HttpStatus.OK).body(transactionService.getUserTransactions(userId));
     }
     @GetMapping("/sourceAccount")
    public ResponseEntity<List<TransactionModel>> getSourceAccountTransactions(@PathVariable String accountNumber,
                                                                               @RequestHeader("X-User-ID") Long userId){
        return ResponseEntity.status(HttpStatus.OK).body(transactionService.getSourceAccountTransactions(accountNumber));
     }
     @GetMapping("/targetAccount")
    public ResponseEntity<List<TransactionModel>> getTargetAccountTransaction(@PathVariable String accountNumber,
                                                                              @RequestHeader("X-User-ID")Long userId){
        return ResponseEntity.status(HttpStatus.OK).body(transactionService.getTargetAccountTransactions(accountNumber));
     }
    @GetMapping("/paginated")
    public ResponseEntity<Page<TransactionModel>> getUserTransactionsPaginated(
            @RequestHeader("X-User-ID") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(
                transactionService.getUserTransactionPaginated(userId, page, size)
        );
    }
    @GetMapping("/recent")
    public ResponseEntity<List<TransactionModel>> getRecentTransactions(
            @RequestHeader("X-User-ID") Long userId
    ) {
        return ResponseEntity.ok(
                transactionService.getTop10ByUserIdOrderByCreatedAtDesc(userId)
        );
    }
}
