package com.ssafy.whoareyou.user.service;

import com.ssafy.whoareyou.user.dto.request.auth.EmailCheckRequestDto;
import com.ssafy.whoareyou.user.dto.request.auth.SignInRequestDto;
import com.ssafy.whoareyou.user.dto.request.auth.SignUpRequestDto;
import com.ssafy.whoareyou.user.dto.response.auth.EmailCheckResponseDto;
import com.ssafy.whoareyou.user.dto.response.auth.SignInResponseDto;
import com.ssafy.whoareyou.user.dto.response.auth.SignUpResponseDto;
import org.springframework.http.ResponseEntity;

public interface AuthService {

    ResponseEntity<? super EmailCheckResponseDto> emailCheck(EmailCheckRequestDto dto);
    ResponseEntity<? super SignUpResponseDto> signUp (SignUpRequestDto dto);
    ResponseEntity<? super SignInResponseDto> signIn (SignInRequestDto dto);
}
