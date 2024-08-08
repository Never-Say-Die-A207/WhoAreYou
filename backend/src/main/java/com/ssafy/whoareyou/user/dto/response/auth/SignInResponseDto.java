package com.ssafy.whoareyou.user.dto.response.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ssafy.whoareyou.common.ResponseCode;
import com.ssafy.whoareyou.common.ResponseMessage;
import com.ssafy.whoareyou.user.dto.response.ResponseDto;

import lombok.Getter;


@Getter
public class SignInResponseDto extends ResponseDto {

    private String accessToken;
    private String refreshToken;
    private int accessTokenExpirationTime;
    private int refreshTokenExpirationTime;

    private SignInResponseDto(String accessToken, String refreshToken) {
        super();
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.accessTokenExpirationTime = 3600; // 1시간
        this.refreshTokenExpirationTime = 1209600; // 14일
    }

    public static ResponseEntity<SignInResponseDto> success(String accessToken, String refreshToken) {
        SignInResponseDto responseBody = new SignInResponseDto(accessToken, refreshToken);
        return ResponseEntity.status(HttpStatus.OK)
                .header("Authorization", "Bearer " + accessToken)
                .body(responseBody);
    }

    public static ResponseEntity<ResponseDto> signInFail() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.SIGN_IN_FAIL, ResponseMessage.SIGN_IN_FAIL);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> invalidRefreshToken() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.INVALID_REFRESH_TOKEN, ResponseMessage.INVALID_REFRESH_TOKEN);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
    }
}
