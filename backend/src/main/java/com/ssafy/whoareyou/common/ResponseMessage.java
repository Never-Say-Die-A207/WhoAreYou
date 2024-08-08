package com.ssafy.whoareyou.common;

public interface ResponseMessage {

    String SUCCESS = "Success.";

    String VALIDATION_FAIL = "Validation failed.";
    String DUPLICATE_EMAIL = "Duplicate Email.";
    String DUPLICATE_NICKNAME = "Duplicate Nickname.";

    String SIGN_IN_FAIL = "Login information mismatch.";
    String LOGOUT_FAIL = "Logout failed.";
    String INVALID_REFRESH_TOKEN = "Invalid refresh token.";

    String DATABASE_ERROR = "Database error.";
}
