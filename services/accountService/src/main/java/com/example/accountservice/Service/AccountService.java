package com.example.accountservice.Service;

import com.example.accountservice.Config.RabbitMQConfig;
import com.example.accountservice.Dto.*;
import com.example.accountservice.Model.AccountModel;
import com.example.accountservice.Repository.AccountRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.NoSuchElementException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;

    public AccountResponseDto createAccount(Long secureUserId, CreateAccountRequestDto request) {
        String accountNumber = generateAccountNumber();
        while (accountRepository.existsByAccountNumber(accountNumber)) {
            accountNumber = generateAccountNumber();
        }
        AccountModel newAccount = new AccountModel();
        newAccount.setUserId(secureUserId);

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


    private AccountResponseDto convertToDto(AccountModel accountModel) {
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

    public AccountResponseDto getAccountById(Long id) {
        Optional<AccountModel> accountOptional = accountRepository.findById(id);

        if (accountOptional.isPresent()) {
            return convertToDto(accountOptional.get());
        } else
            throw new NoSuchElementException("Hesap bulunamadı");
    }

    public AccountResponseDto getAccountByAccountNumber(String accountNumber) {
        Optional<AccountModel> accountOptional = accountRepository.findByAccountNumber(accountNumber);
        if (accountOptional.isPresent()) {
            return convertToDto(accountOptional.get());
        } else
            throw new NoSuchElementException("account numberı:" + accountNumber + "olan hesap bulunmadı ");

    }

    public List<AccountResponseDto> getAccountByUserId(Long userId) {
        List<AccountModel> accounts = accountRepository.findByUserId(userId);

        if (accounts.isEmpty()) {
            return Collections.emptyList();
        } else {
            return accounts.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        }
    }

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Transactional
    public String transfer(Long currentUserId, TransferRequestDto request) {
        Optional<AccountModel> sourceAccountOptional =
                accountRepository.findByAccountNumber(request.getSourceAccountNumber());

        Optional<AccountModel> targetAccountOptional =
                accountRepository.findByAccountNumber(request.getTargetAccountNumber());

        AccountModel sourceAccount = sourceAccountOptional.orElseThrow(
                () -> new NoSuchElementException("kaynak hesap bulunamadı" + request.getSourceAccountNumber())
        );
        AccountModel targetAccount = targetAccountOptional.orElseThrow(
                () -> new NoSuchElementException("hedef hesap bulunamadı" + request.getTargetAccountNumber())
        );

        BigDecimal transferAmount = request.getAmount();

        if (!sourceAccount.getUserId().equals(currentUserId)) {
            throw new RuntimeException("Yetkisiz İşlem: Token sahibi, kaynak hesabın sahibi değil.");
        }

        if (sourceAccount.getBalance().compareTo(transferAmount) < 0) {
            throw new RuntimeException("yetersiz bakiye transfer miktarı:" + request.getAmount());
        }

        sourceAccount.setBalance(sourceAccount.getBalance().subtract(transferAmount));
        targetAccount.setBalance(targetAccount.getBalance().add(transferAmount));

        accountRepository.save(sourceAccount);
        accountRepository.save(targetAccount);

        TransactionMessageDto transactionMessage = new TransactionMessageDto(
                currentUserId,
                request.getSourceAccountNumber(),
                request.getTargetAccountNumber(),
                request.getAmount(),
                "TRANSFER",
                "SUCCESS",
                "Para transferi gerçekleştirildi"
        );

        try {
            String jsonMessage = objectMapper.writeValueAsString(transactionMessage);

            //JSON olarak gönder
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.TRANSACTION_QUEUE,
                    jsonMessage
            );

            System.out.println("📤 RabbitMQ'ya mesaj gönderildi (JSON): " + jsonMessage);

        } catch (Exception e) {
            System.err.println("❌ RabbitMQ mesaj gönderme hatası: " + e.getMessage());
            e.printStackTrace();
        }

        return "Para transferi tamamlandı. Yeni kaynak bakiye: " + sourceAccount.getBalance();
    }

    @Transactional
    public AccountResponseDto updateAccount(UpdateAccountRequestDto request) {
        Optional<AccountModel> optionalAccount = accountRepository.findByAccountNumber(request.getAccountNumber());

        AccountModel updateAccount = optionalAccount.orElseThrow(
                () -> new NoSuchElementException("güncellenecek hesap bulunamadı" + request.getAccountNumber())
        );
        if (request.getAccountType() != null) {
            updateAccount.setAccountType(request.getAccountType());
        }
        return convertToDto(accountRepository.save(updateAccount));
    }

    @Transactional
    public AccountResponseDto deActiveAccount(DeactivateAccountRequestDto request) {
        AccountModel accountToDeactive = accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(()-> new NoSuchElementException("devre dışı bırakıalcak hesap bulunmadı:" + request.getAccountNumber()));

        if(!accountToDeactive.isActive()) {
            throw new RuntimeException("hesap zaten devre dışı!");
        }
        if(accountToDeactive.getBalance().compareTo(BigDecimal.ZERO) != 0) {
            throw new IllegalStateException("Hata: hesap bakiyesi sıfır değil. Devre dışı bırakılması icin bakiyenin transfer edilmes gerekir.");
        }
        accountToDeactive.setActive(false);
        AccountModel deactivatedAccount = accountRepository.save(accountToDeactive);
        return convertToDto(deactivatedAccount);
    }

}

