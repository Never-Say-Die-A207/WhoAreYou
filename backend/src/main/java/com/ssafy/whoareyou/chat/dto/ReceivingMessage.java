package com.ssafy.whoareyou.chat.dto;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReceivingMessage {
    private int roomId;
    private String nickname;
    private String message;
}
