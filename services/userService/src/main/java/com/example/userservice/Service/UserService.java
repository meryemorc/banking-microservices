package com.example.userservice.Service;

import com.example.userservice.Dto.UserDTO;
import com.example.userservice.Dto.UserLoginRequest;
import com.example.userservice.Dto.UserRegistrationRequest;
import com.example.userservice.Model.UserModel;
import com.example.userservice.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public String register(UserRegistrationRequest registerUser){
        if(userRepository.findByUsername(registerUser.getUsername()).isPresent()
                || userRepository.findByEmail(registerUser.getEmail()).isPresent()){
            return "Kayıt başarısız! bu kullanıcı adı zaten var";
        }
        UserModel user = new UserModel();
        user.setUsername(registerUser.getUsername());
        user.setEmail(registerUser.getEmail());
        user.setPassword(registerUser.getPassword());
        userRepository.save(user);
        return "Kayıt başarılı! hoş geldiniz" + user.getUsername();
    }

    public UserDTO login(UserLoginRequest request) {
        UserModel user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı!"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Şifre hatalı!");
        }

        return convertToDTO(user);
    }
    private UserDTO convertToDTO(UserModel user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        return dto;
    }

    public boolean isValidUser(Long userId){
        return userRepository.existsById(userId);
    }
}
