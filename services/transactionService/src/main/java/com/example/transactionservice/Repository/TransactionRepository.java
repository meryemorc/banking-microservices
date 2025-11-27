package com.example.transactionservice.Repository;

import com.example.transactionservice.Model.TransactionModel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository <TransactionModel, Long> {
    List<TransactionModel> findByUserId(Long userId);
    List<TransactionModel> findBySourceAccountNumber(String sourceAccountNumber);
    List<TransactionModel> findByTargetAccountNumber(String targetAccountNumber);
    List<TransactionModel> findTop10ByUserIdOrderByCreatedAtDesc (Long userId);
    Page<TransactionModel> findByUserId(Long userId , Pageable pageable);

}
