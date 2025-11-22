package com.example.transactionservice.repository;

import com.example.transactionservice.model.TransactionModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<TransactionModel,Long> {

    List<TransactionModel> findByUserId(Long userId);

    List<TransactionModel> findBySourceAccountNumber(String sourceAccountNumber);

    List<TransactionModel> findByTargetAccountNumber(String targetAccountNumber);

    Page<TransactionModel> findByUserIdPage(Long userId, Pageable pageable);

    List<TransactionModel> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);
}
