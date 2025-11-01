package com.example.userservice.Service;

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

    public String login(UserLoginRequest loginRequest) {

        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();
        Optional<UserModel> user = userRepository.findByUsername(username);
        if(user.isPresent()){
            if(user.get().getPassword().equals(password)){
                return "giriş başarılı." + user.get().getUsername();
            }
            return "yanlış şifre";
        }
return "kullanıcı bulunamadı";
    }
}
