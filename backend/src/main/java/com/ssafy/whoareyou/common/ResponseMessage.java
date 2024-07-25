package com.ssafy.whoareyou.common;

public interface ResponseMessage {

    String SUCCESS = "Success.";

    String VALIDATION_FAIL = "Validation failed.";
    String DUPLICATE_EMAIL = "Duplicate Email.";

    String SIGN_IN_FAIL = "Login information mismatch.";

    String DATABASE_ERROR = "Database error.";
}
