package com.ssafy.whoareyou.common;

public interface ResponseCode {

    String SUCCESS = "SU";

    String VALIDATION_FAIL = "VF";
    String DUPLICATE_EMAIL = "DE";
    String DUPLICATE_NICKNAME = "DN";

    String SIGN_IN_FAIL = "SF";
    String LOGOUT_FAIL = "LF";
    String INVALID_REFRESH_TOKEN = "IRT";

    String DATABASE_ERROR = "DBE";
}
