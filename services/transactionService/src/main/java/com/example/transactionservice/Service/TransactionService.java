package com.example.transactionservice.Service;

import com.example.transactionservice.Dto.TransactionRequestDto;
import com.example.transactionservice.Dto.TransactionResponseDto;
import com.example.transactionservice.Dto.TransactionStatsDto;
import com.example.transactionservice.Model.TransactionModel;
import com.example.transactionservice.Model.TransactionStatus;
import com.example.transactionservice.Model.TransactionType;
import com.example.transactionservice.Repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
    public List<TransactionModel> findByUserIdBetween(Long userId, LocalDateTime startDate, LocalDateTime endDate){
        return transactionRepository.findByUserIdAndCreatedAtBetween(userId, startDate,  endDate);
    }
    public Page<TransactionModel> findByUserId(Long userId , Pageable pageable){
        return transactionRepository.findByUserId(userId, pageable);
    }
    public List<TransactionModel> filterByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(23, 59, 59);
        return transactionRepository.findByUserIdAndCreatedAtBetween(userId, start, end);
    }
    public List<TransactionModel> filterByStatus(Long userId, TransactionStatus status) {
        return transactionRepository.findByUserIdAndTransactionStatus(userId, status);
    }
    public List<TransactionModel> filterByType(Long userId, TransactionType type) {
        return transactionRepository.findByUserIdAndTransactionType(userId, type);
    }
    public TransactionStatsDto getUserStats(Long userId) {
        List<TransactionModel> transactions = transactionRepository.findByUserId(userId);

        long totalTransactions = transactions.size();
        BigDecimal totalAmount = transactions.stream()
                .map(TransactionModel::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long successCount = transactions.stream()
                .filter(t -> t.getTransactionStatus() == TransactionStatus.SUCCESS)
                .count();

        long failedCount = transactions.stream()
                .filter(t -> t.getTransactionStatus() == TransactionStatus.FAILED)
                .count();

        BigDecimal averageAmount = totalTransactions > 0
                ? totalAmount.divide(BigDecimal.valueOf(totalTransactions), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        return new TransactionStatsDto(totalTransactions, totalAmount, successCount, failedCount, averageAmount);
    }
}
