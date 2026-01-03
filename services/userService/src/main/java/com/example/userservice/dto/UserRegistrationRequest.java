package com.example.userservice.dto;

import lombok.Data;

@Data
public class UserRegistrationRequest {
    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private String tcNo;
    private String phone;
}
