package com.ssafy.whoareyou.chat.dto;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReceivingMessage {
    public String nickname;
    public String message;
}
