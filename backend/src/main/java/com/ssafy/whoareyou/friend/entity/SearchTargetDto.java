package com.ssafy.whoareyou.friend.entity;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SearchTargetDto {
    int maleId, femaleId;
}
