package com.ssafy.whoareyou.friend.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FriendUserDto {
    private int id;
    private String nickname;
}
