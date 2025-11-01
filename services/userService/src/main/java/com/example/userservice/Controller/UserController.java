package com.example.userservice.Controller;

import com.example.userservice.Dto.UserLoginRequest;
import com.example.userservice.Dto.UserRegistrationRequest;
import com.example.userservice.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    @PostMapping("/login")
    public String login (@RequestBody UserLoginRequest loginRequest){
        return userService.login(loginRequest);
    }

    @PostMapping("/register")
    public String register(@RequestBody UserRegistrationRequest registerUser){
        return userService.register(registerUser);
    }
}
