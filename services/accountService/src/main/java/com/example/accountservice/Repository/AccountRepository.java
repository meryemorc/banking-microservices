package com.example.accountservice.Repository;

import com.example.accountservice.Model.AccountModel;
import com.example.accountservice.Model.AccountType;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<AccountModel, Long> {

    Optional<AccountModel> findByAccountNumber(String accountNumber);

    List<AccountModel> findByUserId(Long userId); //bir userın birden fazla hesabı olabilir

    List<AccountModel> findByUserIdAndAccountType(Long userId, AccountType accountType);

    boolean existsByAccountNumber(String accountNumber);

}
