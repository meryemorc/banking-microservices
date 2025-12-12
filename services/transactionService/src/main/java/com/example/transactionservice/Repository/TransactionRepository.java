package com.example.transactionservice.Repository;

import com.example.transactionservice.Model.TransactionModel;
import com.example.transactionservice.Model.TransactionStatus;
import com.example.transactionservice.Model.TransactionType;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository <TransactionModel, Long> {
    List<TransactionModel> findByUserId(Long userId);
    List<TransactionModel> findBySourceAccountNumber(String sourceAccountNumber);
    List<TransactionModel> findByTargetAccountNumber(String targetAccountNumber);
    List<TransactionModel> findTop10ByUserIdOrderByCreatedAtDesc (Long userId);
    List<TransactionModel> findByUserIdAndCreatedAtBetween(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    List<TransactionModel> findByUserIdAndTransactionStatus(Long userId, TransactionStatus status);
    List<TransactionModel> findByUserIdAndTransactionType(Long userId, TransactionType type);
    Page<TransactionModel> findByUserId(Long userId , Pageable pageable);

}
