package com.ssafy.whoareyou.chat.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SearchTargetChatRoom {
    int maleId, femaleId;
}
