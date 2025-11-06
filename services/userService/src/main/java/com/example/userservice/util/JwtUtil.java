package com.example.userservice.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component // Bu sınıfı Spring'e bir Bean olarak tanıt böylece service katmanına otomatik enjekte edilir
public class JwtUtil {

    // Gizli anahtar ve geçerlilik süresi için application.yml'den değer çekeceğiz secret key ve expire date cekiyoruz
    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;

    //gizli anahtar alma secret keyi hashleme güvenli bir hale getirme
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    //token üretim metodu servicete iş amntıgında karısıklık olamsın diye utilde generate ediyoruz
    public String generateToken(UserDetails userDetails, Long userId) {

        // claimsleri  buraya ekleriz.
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);

        return Jwts
                .builder()
                .claims(claims)//ekledigim claimler
                .subject(userDetails.getUsername()) // Token sahibini (username) belirtir
                .issuedAt(new Date(System.currentTimeMillis()))//tokenın olusturulma tarihi
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))//expire date
                .signWith(getSigningKey(), Jwts.SIG.HS256)//tokenı gizli anahtarla imzala
                .compact();//tüm parcaları birleştir ve urli güvenli string haline getir burda buildde kullanabilirdik
    }
    private Claims extractAllClaims(String token) {
        return Jwts
                .parser() //parse eder
                .verifyWith(getSigningKey()) //imzayı tokenı yanı kontrol eder
                .build()
                .parseSignedClaims(token) //bundan sonra icerisidne tum key value ciftlerini iceren bir  claims nesnesine dönüşür
                .getPayload(); //payload:jwtnın ortadaki veri tasıyan kısmıdır jwt bu verilere claims der
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) { //jwtnın tek bir parcasını ayırır
        final Claims claims = extractAllClaims(token);//extractallClaimsden claimsleri alır ve sadece kullanmak istedigini ceker
        return claimsResolver.apply(claims);
    }//claimsResolver:allclaimsden spesiifik claims dondurmeyı bılen jwt fonksiyonudur

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        // Kullanıcı adı eşleşmeli VE token süresi dolmamış olmalı
        return (username.equals(userDetails.getUsername()) && !extractAllClaims(token).getExpiration().before(new Date()));
    }
}
