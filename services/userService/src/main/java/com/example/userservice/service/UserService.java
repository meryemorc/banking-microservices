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



    public String register(UserRegistrationRequest registerUser){
        if(userRepository.findByUsername(registerUser.getUsername()).isPresent()
                || userRepository.findByEmail(registerUser.getEmail()).isPresent()){
            return "Kayıt başarısız! bu kullanıcı adı zaten var";
        }
        UserModel user = new UserModel();
        user.setUsername(registerUser.getUsername());
        user.setEmail(registerUser.getEmail());
        String hashedPassword = passwordEncoder.encode(registerUser.getPassword());
        user.setPassword(hashedPassword);
        userRepository.save(user);
        return "Kayıt başarılı " + user.getUsername();
    }
    public UserLoginResponse login (UserLoginRequest loginUser){
        try {
            // kimlik dogrulama
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginUser.getEmail(), loginUser.getPassword())
            );
            //dogrulandıysa kullanıcıyı cekme
            UserModel user = (UserModel) authentication.getPrincipal();

            String token = jwtUtil.generateToken(user, user.getId());

            return new UserLoginResponse(token, convertToDTO(user));

        } catch (Exception e) {
            throw new RuntimeException("Kimlik doğrulama başarısız. Kullanıcı adı veya şifre hatalı.", e);
        }
    }
    // UserService.java içinde

    private UserDTO convertToDTO(UserModel user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getRealUsername());
        dto.setEmail(user.getEmail());
        return dto;
    }

    public boolean isValidUser(Long userId){
        return userRepository.existsById(userId);
    }
}
