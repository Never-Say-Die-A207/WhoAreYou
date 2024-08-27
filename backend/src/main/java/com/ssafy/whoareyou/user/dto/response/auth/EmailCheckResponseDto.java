package com.ssafy.whoareyou.user.dto.response.auth;

import com.ssafy.whoareyou.common.ResponseCode;
import com.ssafy.whoareyou.common.ResponseMessage;
import com.ssafy.whoareyou.user.dto.response.ResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class EmailCheckResponseDto extends ResponseDto {

    private EmailCheckResponseDto(){
        super();
    }

    public static ResponseEntity<EmailCheckResponseDto> success(){
        EmailCheckResponseDto responseBody = new EmailCheckResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> duplicateEmail() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.DUPLICATE_EMAIL, ResponseMessage.DUPLICATE_EMAIL);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }
}
