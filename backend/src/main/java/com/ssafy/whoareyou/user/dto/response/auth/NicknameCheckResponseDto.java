package com.ssafy.whoareyou.user.dto.response.auth;

import com.ssafy.whoareyou.common.ResponseCode;
import com.ssafy.whoareyou.common.ResponseMessage;
import com.ssafy.whoareyou.user.dto.response.ResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class NicknameCheckResponseDto extends ResponseDto  {

    private NicknameCheckResponseDto(){
        super();
    }

    public static ResponseEntity<NicknameCheckResponseDto> success(){
        NicknameCheckResponseDto responseBody = new NicknameCheckResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> duplicateNickname() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.DUPLICATE_NICKNAME, ResponseMessage.DUPLICATE_NICKNAME);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }
}
