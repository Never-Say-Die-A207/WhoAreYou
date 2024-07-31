package com.ssafy.whoareyou.user.exception;

public class InvalidGenderException extends RuntimeException {
    public InvalidGenderException() {
        super("성별 정보가 유효하지 않습니다 (성별에 따른 검색 Female, Male이 아닌 User 인스턴스로 시도했습니다)");
    }
}
