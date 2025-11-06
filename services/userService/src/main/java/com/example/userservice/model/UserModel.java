package com.example.userservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Table(name="users")
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserModel implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_name", unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }
    // Spring Security, login sırasında veritabanından çektiği kullanıcı adını buradan alır.
    @Override
    public String getUsername() {
        // Biz login için email kullanacağımız için email'i döndürüyoruz.
        return email;
    }
    public String getRealUsername() {
        return username; // DTO dönüşümünde bu metodu kullanacağız.
    }
    @Override
    public String getPassword() {
        // Lombok, getPassword() metodunu zaten oluşturuyor.
        return password;
    }
    @Override
    public boolean isAccountNonExpired() { return true; } // Hesap süresi dolmamış mı?

    @Override
    public boolean isAccountNonLocked() { return true; } // Hesap kilitli değil mi? kullanıcı sifreyi cok yanlıs girerse hesap kilitlenebilir

    @Override
    public boolean isCredentialsNonExpired() { return true; } // Şifre süresi dolmamış mı?

    @Override
    public boolean isEnabled() { return true; } // Hesap aktif mi?
}
