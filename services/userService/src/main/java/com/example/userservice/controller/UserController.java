package com.example.userservice.controller;

import com.example.userservice.dto.UserDTO;
import com.example.userservice.dto.UserLoginRequest;
import com.example.userservice.dto.UserLoginResponse;
import com.example.userservice.dto.UserRegistrationRequest;
import com.example.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponse> login(@RequestBody UserLoginRequest loginRequest) {
        UserLoginResponse user = userService.login(loginRequest);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody UserRegistrationRequest request) {
        String result = userService.register(request);

        Map<String, Object> response = new HashMap<>();
        response.put("message", result);
        response.put("username", request.getUsername());
        response.put("firstName", request.getFirstName());
        response.put("lastName", request.getLastName());
        response.put("tcNo", request.getTcNo());
        response.put("phone", request.getPhone());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/exists/{userId}")
    public ResponseEntity<Boolean> checkUserExists(@PathVariable Long userId) {
        boolean exists = userService.isValidUser(userId);
        return ResponseEntity.ok(exists);

    }
}
