package com.example.creditservice.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableRabbit
public class RabbitMQConfig {

    public static final String CREDIT_APPROVAL_QUEUE = "credit.approval.queue";

    @Bean
    public Queue creditApprovalQueue() {
        return new Queue(CREDIT_APPROVAL_QUEUE, true);  // durable = true
    }
}