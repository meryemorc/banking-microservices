package com.example.accountservice.Service;

import com.example.accountservice.Dto.AccountResponseDto;
import com.example.accountservice.Dto.CreateAccountRequestDto;
import com.example.accountservice.Dto.TransferRequestDto;
import com.example.accountservice.Model.AccountModel;
import com.example.accountservice.Repository.AccountRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.NoSuchElementException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;

    public AccountResponseDto createAccount(CreateAccountRequestDto request){
        checkUserExist(request.getUserId());
        String accountNumber = generateAccountNumber();
        while (accountRepository.existsByAccountNumber(accountNumber)) {
            accountNumber = generateAccountNumber();
        }

            AccountModel newAccount = new AccountModel();
            newAccount.setUserId(request.getUserId());
            newAccount.setAccountNumber(accountNumber);
            newAccount.setBalance(request.getInitialBalance());
            newAccount.setAccountType(request.getAccountType());

            return convertToDto(accountRepository.save(newAccount));

        }
    private String generateAccountNumber() {
        long timestamp = System.currentTimeMillis();
        int random = new Random().nextInt(9999);
        return String.format("ACC-%d%04d", timestamp % 1000000, random);
    }
    private void checkUserExist(Long userId){
        if(userId==null || userId<0){
            throw new IllegalArgumentException("user id gecerli değil");
        }
    }
    private AccountResponseDto convertToDto(AccountModel accountModel){
        AccountResponseDto accountResponseDto = new AccountResponseDto();
        accountResponseDto.setId(accountModel.getId());
        accountResponseDto.setAccountNumber(accountModel.getAccountNumber());
        accountResponseDto.setBalance(accountModel.getBalance());
        accountResponseDto.setAccountType(accountModel.getAccountType());
        accountResponseDto.setCreatedAt(accountModel.getCreatedAt());
        accountResponseDto.setUpdatedAt(accountModel.getUpdatedAt());
        accountResponseDto.setUserId(accountModel.getUserId());
        return accountResponseDto;
    }

    public AccountResponseDto getAccountById(Long id){
       Optional<AccountModel> accountOptional = accountRepository.findById(id);

       if(accountOptional.isPresent()){
           return convertToDto(accountOptional.get());
       }
       else
            return null;
    }
    public AccountResponseDto getAccountByAccountNumber(String accountNumber){
        Optional<AccountModel> accountOptional = accountRepository.findByAccountNumber(accountNumber);
        if(accountOptional.isPresent()){
            return convertToDto(accountOptional.get());
        }else
            throw new NoSuchElementException("account numberı:" + accountNumber + "olan hesap bulunmadı ");

    }
    public List<AccountResponseDto> getAccountByUserId(Long userId){
        List<AccountModel> accounts = accountRepository.findByUserId(userId);

        if(accounts.isEmpty()){
            return Collections.emptyList();
        } else{
            return accounts.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList()); // Şimdi dönüş tipi eşleşiyor
        }
    }
    @Transactional
    public String transfer(TransferRequestDto request){
        Optional<AccountModel> sourceAccountOptional =
                accountRepository.findByAccountNumber(request.getSourceAccountNumber());

        Optional<AccountModel> targetAccountOptional =
                accountRepository.findByAccountNumber(request.getTargetAccountNumber());
        AccountModel sourceAccount = sourceAccountOptional.orElseThrow(
                () -> new NoSuchElementException("Kaynak hesap bulunamadı: " + request.getSourceAccountNumber())
        );
        AccountModel targetAccount = targetAccountOptional.orElseThrow(
                () -> new NoSuchElementException("Hedef hesap bulunamadı: " + request.getTargetAccountNumber())
        );

        BigDecimal transferAmount = request.getAmount();

        if (sourceAccount.getBalance().compareTo(transferAmount) < 0) {

            throw new RuntimeException("Yetersiz bakiye! Transfer miktarı: " + transferAmount);
        }


        sourceAccount.setBalance(sourceAccount.getBalance().subtract(transferAmount));


        targetAccount.setBalance(targetAccount.getBalance().add(transferAmount));


        accountRepository.save(sourceAccount);
        accountRepository.save(targetAccount);

        return "Para transferi tamamlandı. Yeni kaynak bakiye: " + sourceAccount.getBalance();

    }
    }

