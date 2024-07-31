package com.ssafy.whoareyou.user.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(int userId) {
        super("id '" + userId + "' 을(를) id로 갖는 회원이 존재하지 않습니다.");
    }
}
