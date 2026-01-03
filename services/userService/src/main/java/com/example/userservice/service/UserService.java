package com.example.userservice.service;

import com.example.userservice.dto.UserDTO;
import com.example.userservice.dto.UserLoginRequest;
import com.example.userservice.dto.UserLoginResponse;
import com.example.userservice.dto.UserRegistrationRequest;
import com.example.userservice.model.UserModel;
import com.example.userservice.repository.UserRepository;
import com.example.userservice.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public String register(UserRegistrationRequest registerUser) {

        if (userRepository.findByUsername(registerUser.getUsername()).isPresent()
                || userRepository.findByEmail(registerUser.getEmail()).isPresent()) {
            throw new RuntimeException("Bu kullanıcı adı veya e-posta zaten kullanılıyor!");
        }

        UserModel user = new UserModel();
        user.setUsername(registerUser.getUsername());
        user.setEmail(registerUser.getEmail());
        user.setFirstName(registerUser.getFirstName());  // ← YENİ
        user.setLastName(registerUser.getLastName());    // ← YENİ
        user.setTcNo(registerUser.getTcNo());            // ← YENİ
        user.setPhone(registerUser.getPhone());          // ← YENİ

        String hashedPassword = passwordEncoder.encode(registerUser.getPassword());
        user.setPassword(hashedPassword);
        user.setRole("USER");

        userRepository.save(user);
        return "Kayıt başarılı: " + user.getUsername();
    }

    public UserLoginResponse login(UserLoginRequest loginUser) {
        try {
            // Kimlik doğrulama
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginUser.getEmail(), loginUser.getPassword())
            );

            UserModel user = (UserModel) authentication.getPrincipal();
            String token = jwtUtil.generateToken(user, user.getId());

            // UserDTO oluştur
            UserDTO userDTO = new UserDTO(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getTcNo(),
                    user.getPhone()
            );

            // UserLoginResponse oluştur
            return new UserLoginResponse(token, userDTO);

        } catch (Exception e) {
            throw new RuntimeException("Kimlik doğrulama başarısız. E-posta veya şifre hatalı.", e);
        }
    }

    private UserDTO convertToDTO(UserModel user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getRealUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        return dto;
    }

    public boolean isValidUser(Long userId) {
        return userRepository.existsById(userId);
    }
}