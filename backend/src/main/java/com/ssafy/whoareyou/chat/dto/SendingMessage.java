package com.ssafy.whoareyou.chat.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SendingMessage {
    public String sender;
    public String message;
    public String time;
}
