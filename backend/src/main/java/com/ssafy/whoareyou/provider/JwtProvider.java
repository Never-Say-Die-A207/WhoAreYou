package com.ssafy.whoareyou.provider;

import java.util.Date;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtProvider {

    @Value("${secret-key}")
    private String secretKey;

//    public String create (String userId){ // Jwt 생성
//
//        Date expiredDate = Date.from(Instant.now().plus(1, ChronoUnit.HOURS));
//        Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
//
//        String jwt = Jwts.builder()
//                .signWith(key, SignatureAlgorithm.HS256)
//                .setSubject(userId)
//                .setIssuedAt(new Date()).setExpiration(expiredDate)
//                .compact();
//        return jwt;
//
//    }

    public String createAccessToken(String userId){
        return createToken(userId, 1, ChronoUnit.DAYS);
    }

    public String createRefreshToken(String userId){
        return createToken(userId, 14, ChronoUnit.DAYS);
    }

    private String createToken(String userId, long amount, ChronoUnit unit){
        Date expiredDate = Date.from(Instant.now().plus(amount, unit));
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
                .signWith(key, SignatureAlgorithm.HS256)
                .setSubject(userId)
                .setIssuedAt(new Date())
                .setExpiration(expiredDate)
                .compact();
    }

    public String validate (String jwt) {

        String subject = null;
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));

        try{
            subject =  Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwt)
                    .getBody()
                    .getSubject();
        } catch (Exception exception){
            exception.printStackTrace();
            return null;
        }

        return subject;
    }

    public String getUserId(String token) {
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
