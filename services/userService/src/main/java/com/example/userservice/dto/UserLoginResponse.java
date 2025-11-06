package com.example.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginResponse {

    // 1. JWT Token'ı (Spring Security'den gelecek)
    private String token;

    // 2. Kullanıcı Bilgileri (Sizin zaten var olan DTO'nuz)
    private UserDTO user;
}
