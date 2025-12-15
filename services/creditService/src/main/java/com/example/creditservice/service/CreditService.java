package com.example.creditservice.service;

import com.example.creditservice.dto.*;
import com.example.creditservice.model.*;
import com.example.creditservice.repository.CreditRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CreditService {

    @Autowired
    private CreditRepository creditRepository;

    @Autowired
    private CreditScoreService creditScoreService;

    @Autowired
    private CreditApprovalProducer creditApprovalProducer;

    @Transactional
    public CreditResponseDto applyForCredit(Long userId, CreditApplicationDto dto) {

        // 1. Kredi skorunu hesapla
        int creditScore = creditScoreService.calculateCreditScore(userId);

        // 2. Faiz oranını belirle (skor bazlı)
        BigDecimal interestRate = determineInterestRate(creditScore);

        // 3. Aylık ödeme hesapla
        BigDecimal monthlyPayment = calculateMonthlyPayment(
                dto.getRequestedAmount(),
                interestRate,
                dto.getInstallments()
        );

        // 4. Credit entity oluştur
        Credit credit = new Credit();
        credit.setUserId(userId);
        credit.setRequestedAmount(dto.getRequestedAmount());
        credit.setInstallments(dto.getInstallments());
        credit.setPurpose(dto.getPurpose());
        credit.setCreditScore(creditScore);
        credit.setInterestRate(interestRate);
        credit.setMonthlyPayment(monthlyPayment);

        // 5. Otomatik karar (skor bazlı)
        if (creditScore < 300) {
            // Otomatik RED
            credit.setStatus(CreditStatus.REJECTED);
        } else if (creditScore >= 600) {
            // Otomatik ONAY
            credit.setStatus(CreditStatus.APPROVED);
            credit.setApprovedAmount(dto.getRequestedAmount());
            credit.setApprovedAt(LocalDateTime.now());
        } else {
            // Manuel onay bekle (300-600 arası)
            credit.setStatus(CreditStatus.PENDING);
        }

        credit = creditRepository.save(credit);

        return mapToDto(credit);
    }

    public List<CreditResponseDto> getUserCredits(Long userId) {
        return creditRepository.findByUserId(userId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public CreditResponseDto getCreditById(Long creditId) {
        Credit credit = creditRepository.findById(creditId)
                .orElseThrow(() -> new RuntimeException("Kredi bulunamadı: " + creditId));
        return mapToDto(credit);
    }

    // ADMIN: Bekleyen başvuruları listele
    public List<CreditResponseDto> getPendingCredits() {
        return creditRepository.findByStatus(CreditStatus.PENDING)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // ADMIN: Kredi onayla
    @Transactional
    public CreditResponseDto approveCredit(Long creditId, Long adminUserId) {
        Credit credit = creditRepository.findById(creditId)
                .orElseThrow(() -> new RuntimeException("Kredi bulunamadı: " + creditId));

        if (credit.getStatus() != CreditStatus.PENDING) {
            throw new RuntimeException("Sadece PENDING durumundaki krediler onaylanabilir!");
        }

        credit.setStatus(CreditStatus.APPROVED);
        credit.setApprovedAmount(credit.getRequestedAmount());
        credit.setApprovedAt(LocalDateTime.now());
        credit.setApprovedBy(adminUserId);

        credit = creditRepository.save(credit);

        // RabbitMQ'ya mesaj gönder (Account Service'e para yatır)
        creditApprovalProducer.sendApprovalMessage(credit);

        return mapToDto(credit);
    }

    // ADMIN: Kredi reddet
    @Transactional
    public CreditResponseDto rejectCredit(Long creditId, Long adminUserId) {
        Credit credit = creditRepository.findById(creditId)
                .orElseThrow(() -> new RuntimeException("Kredi bulunamadı: " + creditId));

        if (credit.getStatus() != CreditStatus.PENDING) {
            throw new RuntimeException("Sadece PENDING durumundaki krediler reddedilebilir!");
        }

        credit.setStatus(CreditStatus.REJECTED);
        credit.setApprovedBy(adminUserId);

        credit = creditRepository.save(credit);

        return mapToDto(credit);
    }

    // Faiz oranını belirle
    private BigDecimal determineInterestRate(int creditScore) {
        if (creditScore >= 800) return new BigDecimal("1.20");      // %1.20
        if (creditScore >= 600) return new BigDecimal("1.50");      // %1.50
        if (creditScore >= 400) return new BigDecimal("2.00");      // %2.00
        return new BigDecimal("2.50");                               // %2.50
    }

    // Aylık ödeme hesapla (basit faiz)
    private BigDecimal calculateMonthlyPayment(BigDecimal amount, BigDecimal interestRate, Integer installments) {
        BigDecimal totalInterest = amount.multiply(interestRate).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = amount.add(totalInterest);
        return totalAmount.divide(new BigDecimal(installments), 2, RoundingMode.HALF_UP);
    }

    // Entity -> DTO
    private CreditResponseDto mapToDto(Credit credit) {
        return new CreditResponseDto(
                credit.getId(),
                credit.getUserId(),
                credit.getRequestedAmount(),
                credit.getApprovedAmount(),
                credit.getInstallments(),
                credit.getMonthlyPayment(),
                credit.getInterestRate(),
                credit.getCreditScore(),
                credit.getStatus(),
                credit.getPurpose(),
                credit.getCreatedAt(),
                credit.getApprovedAt()
        );
    }

    public List<CreditResponseDto> getUserActiveCredits(Long userId) {
        return creditRepository.findByUserIdAndStatus(userId, CreditStatus.ACTIVE)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }


    public List<CreditResponseDto> getAllCredits() {
        return creditRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }


    public List<CreditResponseDto> getCreditsByStatus(String status) {
        try {
            CreditStatus creditStatus = CreditStatus.valueOf(status.toUpperCase());
            return creditRepository.findByStatus(creditStatus)
                    .stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Geçersiz kredi statüsü: " + status);
        }
    }
}
