package com.example.creditservice.repository;


import com.example.creditservice.model.Credit;
import com.example.creditservice.model.CreditStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CreditRepository extends JpaRepository<Credit, Long> {

    List<Credit> findByUserId(Long userId);

    List<Credit> findByStatus(CreditStatus status);

    List<Credit> findByUserIdAndStatus(Long userId, CreditStatus status);
}
