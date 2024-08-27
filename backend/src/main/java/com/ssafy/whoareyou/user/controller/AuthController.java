package com.ssafy.whoareyou.user.controller;

import com.ssafy.whoareyou.user.dto.request.auth.*;
import com.ssafy.whoareyou.user.dto.response.ResponseDto;
import com.ssafy.whoareyou.user.dto.response.UserResponseDto;
import com.ssafy.whoareyou.user.dto.response.auth.*;
import com.ssafy.whoareyou.user.dto.request.auth.RefreshTokenRequestDto;
import com.ssafy.whoareyou.user.entity.User;
import com.ssafy.whoareyou.user.repository.UserRepository;
import com.ssafy.whoareyou.user.service.AuthService;
import com.ssafy.whoareyou.provider.JwtProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

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

    @PostMapping("/logout")
    public ResponseEntity<? super LogoutResponseDto> logout(
            @RequestBody @Valid LogoutRequestDto requestBody
    ){
        ResponseEntity<? super LogoutResponseDto> response = authService.logout(requestBody);
        return response;
    }

    @GetMapping("/user/{id}") //회원 정보 확인
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable int id){

        try {

            UserResponseDto userResponseDto = authService.getUserById(id);
            return ResponseEntity.ok(userResponseDto);

        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/refresh") //리프레시 토큰을 사용한 새로운 액세스 토큰 발급
    public ResponseEntity<? super SignInResponseDto> refresh(@RequestBody RefreshTokenRequestDto dto) {
        String newAccessToken = null;
        String refreshToken = dto.getRefreshToken();

        try {
            String userId = jwtProvider.validate(refreshToken);
            if (userId == null) {
                return SignInResponseDto.invalidRefreshToken();
            }

            // 데이터베이스에서 저장된 리프레시 토큰과 비교
            User user = userRepository.findById(Integer.parseInt(userId))
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!refreshToken.equals(user.getRefreshToken())) {
                return SignInResponseDto.invalidRefreshToken();
            }

            // 새 액세스 토큰 발급
            newAccessToken = jwtProvider.createAccessToken(userId);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return SignInResponseDto.success(newAccessToken, refreshToken);
    }
}

