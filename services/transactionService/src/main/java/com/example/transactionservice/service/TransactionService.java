package com.example.transactionservice.service;

import com.example.transactionservice.dto.TransactionRequestDto;
import com.example.transactionservice.model.TransactionModel;
import com.example.transactionservice.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;


    public TransactionModel createTransaction(TransactionRequestDto request) {
        TransactionModel transaction = new TransactionModel();
        transaction.setUserId(request.getUserId());
        transaction.setSourceAccountNumber(request.getSourceAccountNumber());
        transaction.setTargetAccountNumber(request.getTargetAccountNumber());
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getTransactionType());
        transaction.setTransactionStatus(request.getTransactionStatus());
        transaction.setDescription(request.getDescription());

        return transactionRepository.save(transaction);
    }
    public List<TransactionModel> getUserTransactions(Long userId) {
        return transactionRepository.findByUserId(userId);
    }
    public List<TransactionModel> getSourceAccountTransactions(String accountNumber){
        return transactionRepository.findBySourceAccountNumber(accountNumber);
    }
    public List<TransactionModel> getTargetAccountTransactions(String accountNumber){
        return transactionRepository.findByTargetAccountNumber(accountNumber);
    }
    public Page<TransactionModel> getUserTransactionPaginated(Long userId, int page, int size){
        return transactionRepository.findByUserIdPage(userId, PageRequest.of(page,size));
    }
    public List<TransactionModel> getTop10ByUserIdOrderByCreatedAtDesc(Long userId){
        return transactionRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId);
    }
}
