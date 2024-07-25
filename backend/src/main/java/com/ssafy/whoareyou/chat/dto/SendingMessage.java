package com.ssafy.whoareyou.chat.dto;

import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.time.LocalTime;

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
