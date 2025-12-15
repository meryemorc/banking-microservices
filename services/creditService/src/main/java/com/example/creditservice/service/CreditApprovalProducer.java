package com.example.creditservice.service;

import com.example.creditservice.dto.CreditApprovalMessageDto;
import com.example.creditservice.model.Credit;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CreditApprovalProducer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String CREDIT_APPROVAL_QUEUE = "credit.approval.queue";

    public void sendApprovalMessage(Credit credit) {
        try {
            // CreditApprovalMessageDto oluştur
            CreditApprovalMessageDto message = new CreditApprovalMessageDto(
                    credit.getId(),
                    credit.getUserId(),
                    null,  // accountNumber - Account Service'ten alınacak
                    credit.getApprovedAmount(),
                    "Kredi onaylandı: " + credit.getApprovedAmount() + " TL"
            );

            // JSON string'e çevir
            String jsonMessage = objectMapper.writeValueAsString(message);

            // RabbitMQ'ya gönder
            rabbitTemplate.convertAndSend(CREDIT_APPROVAL_QUEUE, jsonMessage);

            System.out.println("📤 Kredi onay mesajı gönderildi: " + jsonMessage);

        } catch (Exception e) {
            System.err.println("❌ Kredi onay mesajı gönderilirken hata: " + e.getMessage());
            e.printStackTrace();
        }
    }
}