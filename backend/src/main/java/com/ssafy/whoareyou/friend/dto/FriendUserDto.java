package com.ssafy.whoareyou.friend.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FriendUserDto {
    String email;
    String name;
    String nickname;
    String gender;
    String type;
}
