package com.example.userservice.Controller;

import com.example.userservice.Dto.UserDTO;
import com.example.userservice.Dto.UserLoginRequest;
import com.example.userservice.Dto.UserRegistrationRequest;
import com.example.userservice.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody UserLoginRequest loginRequest) {
        UserDTO user = userService.login(loginRequest);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody UserRegistrationRequest request) {
        String result = userService.register(request);

        Map<String, Object> response = new HashMap<>();
        response.put("message", result);
        response.put("username", request.getUsername());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/exists/{userId}")
    public ResponseEntity<Boolean> checkUserExists(@PathVariable Long userId) {
        boolean exists = userService.isValidUser(userId);
        return ResponseEntity.ok(exists);

    }
}
