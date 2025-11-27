package com.example.transactionservice.Service;

import com.example.transactionservice.Dto.TransactionRequestDto;
import com.example.transactionservice.Dto.TransactionResponseDto;
import com.example.transactionservice.Model.TransactionModel;
import com.example.transactionservice.Repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;

    public TransactionResponseDto createTransaction(TransactionRequestDto request) { // Dönüş tipi DTO
        TransactionModel m1 = new TransactionModel();
        m1.setUserId(request.getUserId());
        m1.setAmount(request.getAmount());
        m1.setTransactionType(request.getTransactionType());
        m1.setTransactionStatus(request.getTransactionStatus());
        m1.setSourceAccountNumber(request.getSourceAccountNumber()); // Eklendi
        m1.setTargetAccountNumber(request.getTargetAccountNumber()); // Eklendi
        m1.setDescription(request.getDescription()); // Eklendi

        TransactionModel savedModel = transactionRepository.save(m1); // Kaydedilen Model

        return new TransactionResponseDto(
                savedModel.getId(),
                savedModel.getUserId(),
                savedModel.getSourceAccountNumber(),
                savedModel.getTargetAccountNumber(),
                savedModel.getAmount(),
                savedModel.getTransactionType(),
                savedModel.getTransactionStatus(),
                savedModel.getDescription(),
                savedModel.getCreatedAt()
        );
    }
    public List<TransactionModel> getUserTransactions(Long userId) {
        return transactionRepository.findByUserId(userId);
    }
    public List<TransactionModel> findBySourceAccountNumber(String sourceAccountNumber){
        return transactionRepository.findBySourceAccountNumber(sourceAccountNumber);
    }
    public List<TransactionModel> findByTargetAccountNumber(String targetAccountNumber){
        return transactionRepository.findByTargetAccountNumber(targetAccountNumber);
    }
    public List<TransactionModel> findTop10ByUserIdOrderByCreatedAtDesc(Long userId){
        return transactionRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId);
    }
    public Page<TransactionModel> findByUserId(Long userId , Pageable pageable){
        return transactionRepository.findByUserId(userId, pageable);
    }
}
