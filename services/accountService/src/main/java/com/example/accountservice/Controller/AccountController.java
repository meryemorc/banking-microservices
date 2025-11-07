package com.example.accountservice.Controller;

import com.example.accountservice.Dto.*;
import com.example.accountservice.Repository.AccountRepository;
import com.example.accountservice.Service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/accounts")
public class AccountController {

    private final AccountService accountService;

    @PostMapping("/create")
    public ResponseEntity<AccountResponseDto> createAccount(
            @RequestHeader("X-User-ID") Long userId,
            @RequestBody CreateAccountRequestDto createAccount){

        createAccount.setUserId(userId);
        AccountResponseDto newAccount = accountService.createAccount(userId, createAccount);
        return new ResponseEntity<> (newAccount, HttpStatus.CREATED);
    }

    @PostMapping("/transfer")
    public ResponseEntity<String> transfer (
            @RequestHeader("X-User-ID") Long currentUserId, // 1. Gateway'den Header'ı yakala
            @RequestBody TransferRequestDto request)
    {
        // 2. Service metodunu, currentUserId ve DTO ile çağır.
        String transferAccount = accountService.transfer(currentUserId, request);

        return new ResponseEntity<>(transferAccount, HttpStatus.OK);
    }
    @PostMapping("/update")
    public ResponseEntity<AccountResponseDto> updateAccount(@RequestBody UpdateAccountRequestDto updateAccount) {
        AccountResponseDto updated = accountService.updateAccount(updateAccount);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }
    @PostMapping("/deactivate")
    public ResponseEntity<AccountResponseDto> deactivateAccount(@RequestBody DeactivateAccountRequestDto account) {
        AccountResponseDto deactivate = accountService.deActiveAccount(account);
        return new ResponseEntity<>(deactivate, HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<AccountResponseDto> getAccountById(@PathVariable long id) {
        AccountResponseDto account = accountService.getAccountById(id);
        return new ResponseEntity<>(account, HttpStatus.OK);
    }

    @GetMapping("/accountNumber/{accountNumber}")
    public ResponseEntity<AccountResponseDto> getAccountByAccountNumber(@PathVariable String accountNumber) {
        AccountResponseDto account = accountService.getAccountByAccountNumber(accountNumber);
        return new ResponseEntity<>(account, HttpStatus.OK);
    }

    @GetMapping("/my-accounts") // URL'yi daha mantıklı bir isimle değiştirdik
    public ResponseEntity<List<AccountResponseDto>> getMyAccounts(@RequestHeader("X-User-ID") Long userId) {
        // Servis çağrısı hala aynı: AccountService, bu ID'ye göre hesapları getirir.
        List<AccountResponseDto> accounts = accountService.getAccountByUserId(userId);
        return new ResponseEntity<>(accounts, HttpStatus.OK);
    }
}
