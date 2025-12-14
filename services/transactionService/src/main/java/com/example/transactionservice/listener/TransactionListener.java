package com.example.transactionservice.listener;

import com.example.transactionservice.Dto.TransactionMessageDto;
import com.example.transactionservice.Model.TransactionModel;
import com.example.transactionservice.Model.TransactionStatus;
import com.example.transactionservice.Model.TransactionType;
import com.example.transactionservice.Repository.TransactionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TransactionListener {

    @Autowired
    private  TransactionRepository transactionRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @RabbitListener(queues = "transaction.queue")
    public void handleTransactionMessage(Message message) {
        try {
            // JSON'dan deserialize et
            String json = new String(message.getBody());
            TransactionMessageDto dto = objectMapper.readValue(json, TransactionMessageDto.class);

            System.out.println("📨 Mesaj alındı: " + dto);

            TransactionModel transaction = new TransactionModel();
            transaction.setUserId(dto.getUserId());
            transaction.setSourceAccountNumber(dto.getSourceAccountNumber());
            transaction.setTargetAccountNumber(dto.getTargetAccountNumber());
            transaction.setAmount(dto.getAmount());
            transaction.setTransactionType(TransactionType.valueOf(dto.getTransactionType()));
            transaction.setTransactionStatus(TransactionStatus.valueOf(dto.getTransactionStatus()));
            transaction.setDescription(dto.getDescription());

            transactionRepository.save(transaction);
            System.out.println("✅ Transaction kaydedildi: " + transaction);

        } catch (Exception e) {
            System.err.println("❌ Mesaj işlenirken hata: " + e.getMessage());
            e.printStackTrace();
        }
    }
}