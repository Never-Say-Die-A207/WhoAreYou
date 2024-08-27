package com.ssafy.whoareyou.facechat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class FaceChatResultRequest {
    private Integer roomId;
    private Integer myId;
    private Integer partnerId;
    private Boolean friend;
}
