package com.example.accountservice.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "USER-SERVİCE")
public interface UserClient {

    @GetMapping("/users/exists/{userId}")
    ResponseEntity<Boolean> checkUserExists(@PathVariable("userId") Long userId);
}
