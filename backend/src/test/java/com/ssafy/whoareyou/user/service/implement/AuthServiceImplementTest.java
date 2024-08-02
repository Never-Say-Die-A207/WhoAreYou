package com.ssafy.whoareyou.user.service.implement;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AuthServiceImplementTest {
    @Autowired
    private AuthServiceImplement authServiceImplement;

    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();;

    @Test
    void createPassword(){
        String password = "test";
        String encodedPassword1 = passwordEncoder.encode("password");
        String encodedPassword2 = passwordEncoder.encode("password");
        String encodedPassword3 = passwordEncoder.encode("password");

        System.out.println("encodedPassword1 = " + encodedPassword1);
        System.out.println("encodedPassword2 = " + encodedPassword2);
        System.out.println("encodedPassword3 = " + encodedPassword3);
    }
}