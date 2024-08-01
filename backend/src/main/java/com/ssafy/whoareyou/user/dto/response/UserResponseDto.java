package com.ssafy.whoareyou.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserResponseDto {
    private String email;
    private String name;
    private String nickname;
    private String type;
    private Integer successCount;
    private Integer matchingCount;
}