package com.ssafy.whoareyou.friend;

import com.ssafy.whoareyou.entity.Friend;
import com.ssafy.whoareyou.entity.User;
import lombok.Getter;

@Getter
public class FriendResponse {

    private final Integer userId;
    private final String gender;
    private final String email;
    private final String name;
    private final String nickname;

    public FriendResponse(User user){
        userId = user.getId();
        gender = user.getGender();
        email = user.getEmail();
        name = user.getName();
        nickname = user.getNickname();
    }
}
