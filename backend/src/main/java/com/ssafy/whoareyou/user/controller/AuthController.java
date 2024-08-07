package com.ssafy.whoareyou.user.controller;

import com.ssafy.whoareyou.user.dto.request.auth.EmailCheckRequestDto;
import com.ssafy.whoareyou.user.dto.request.auth.NicknameCheckRequestDto;
import com.ssafy.whoareyou.user.dto.request.auth.SignInRequestDto;
import com.ssafy.whoareyou.user.dto.request.auth.SignUpRequestDto;
import com.ssafy.whoareyou.user.dto.response.UserResponseDto;
import com.ssafy.whoareyou.user.dto.response.auth.EmailCheckResponseDto;
import com.ssafy.whoareyou.user.dto.response.auth.NicknameCheckResponseDto;
import com.ssafy.whoareyou.user.dto.response.auth.SignInResponseDto;
import com.ssafy.whoareyou.user.dto.response.auth.SignUpResponseDto;
import com.ssafy.whoareyou.user.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/email-check")
    public ResponseEntity<? super EmailCheckResponseDto> emailCheck (
            @RequestBody @Valid EmailCheckRequestDto requestBody
    ) {
        ResponseEntity<? super EmailCheckResponseDto> response = authService.emailCheck(requestBody);
        return response;
    }

    @PostMapping("/nickname-check")
    public ResponseEntity<? super NicknameCheckResponseDto> nicknameCheck (
            @RequestBody @Valid NicknameCheckRequestDto requestBody
    ) {
        ResponseEntity<? super NicknameCheckResponseDto> response = authService.nicknameCheck(requestBody);
        return response;
    }


    @PostMapping("/sign-up")
    public ResponseEntity<? super SignUpResponseDto> signUp(
            @RequestBody @Valid SignUpRequestDto requestBody
    ) {
        ResponseEntity<? super SignUpResponseDto> response = authService.signUp(requestBody);
        return response;
    }

    @PostMapping("/sign-in")
    public ResponseEntity<? super SignInResponseDto> signIn(
            @RequestBody @Valid SignInRequestDto requestBody
    ){
        ResponseEntity<? super SignInResponseDto> response = authService.signIn(requestBody);
        return response;
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable int id){

        try {

            UserResponseDto userResponseDto = authService.getUserById(id);
            return ResponseEntity.ok(userResponseDto);

        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
