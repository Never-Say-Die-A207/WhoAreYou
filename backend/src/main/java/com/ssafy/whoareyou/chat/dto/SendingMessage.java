package com.ssafy.whoareyou.chat.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SendingMessage {
    private String sender;
    private String message;
    private String time;
}
