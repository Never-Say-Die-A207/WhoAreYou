package com.ssafy.whoareyou.user.dto.request.auth;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LogoutRequestDto {
    @NotNull
    private int userId;
}
