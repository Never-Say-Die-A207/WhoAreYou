package com.ssafy.whoareyou.facechat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
public class FaceChatInfoResponse {
    private int id;
    private String mask;
    private LocalDateTime startedAt;
}
