package com.ssafy.whoareyou.facechat.exception;

public class FaceChatNotFoundException extends RuntimeException {
    public FaceChatNotFoundException() {
        super("There is no such face chat.");
    }
}
