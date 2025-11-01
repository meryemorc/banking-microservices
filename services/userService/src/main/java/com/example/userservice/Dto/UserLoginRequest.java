package com.example.userservice.Dto;

import lombok.Data;

@Data
public class UserLoginRequest {
    private String username;
    private String password;

}
