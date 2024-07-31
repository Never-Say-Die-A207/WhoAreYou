package com.ssafy.whoareyou.facechat.exception;

public class FaceChatNotFoundException extends RuntimeException {
    public FaceChatNotFoundException() {
        super("조건에 해당하는 화상채팅방을 찾을 수 없습니다.");
    }
}
