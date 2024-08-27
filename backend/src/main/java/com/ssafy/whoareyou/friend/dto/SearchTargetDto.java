package com.ssafy.whoareyou.friend.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SearchTargetDto {
    int maleId, femaleId;
}
