package com.ssafy.whoareyou.facechat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class FaceChatRequest {
    private Integer userId;
    private String mask;
}
