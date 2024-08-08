package com.ssafy.whoareyou.user.dto.response.auth;

import com.ssafy.whoareyou.common.ResponseCode;
import com.ssafy.whoareyou.common.ResponseMessage;
import com.ssafy.whoareyou.user.dto.response.ResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class LogoutResponseDto extends ResponseDto {

    private LogoutResponseDto(){
        super();
    }

    public static ResponseEntity<LogoutResponseDto> success() {
        LogoutResponseDto responseBody = new LogoutResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> logoutFail() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.LOGOUT_FAIL, ResponseMessage.LOGOUT_FAIL);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
    }
}
