package com.ssafy.whoareyou.friend;

import com.ssafy.whoareyou.user.User;
import lombok.Getter;

@Getter
public class FriendResponseDto {
    private long friendId;
    private int userId;
    private String email;
    private String name;
    private String nickname;
    private String gender;

    public void setFriendResponseDto(Friend friend){
        friendId = friend.getId();
        User to = friend.getTo();
        userId = to.getId();
        email = to.getEmail();
        name = to.getName();
        nickname = to.getNickname();
        gender = to.getGender();
    }
}
