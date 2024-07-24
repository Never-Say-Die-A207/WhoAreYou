package com.ssafy.whoareyou.user;

import com.ssafy.whoareyou.facechat.FaceChat;
import com.ssafy.whoareyou.friend.Friend;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
public class User {
    @Id @GeneratedValue
    private Integer id;

    private String email;
    private String name;
    private String nickname;
    private String gender;
    private int totalMatchingCount;
    private String type;

    @OneToMany(mappedBy = "from", cascade = CascadeType.ALL)
    private List<Friend> friends = new ArrayList<>();

    @OneToOne(mappedBy = "male", fetch = FetchType.LAZY)
    private FaceChat faceChatAsMale;

    @OneToOne(mappedBy = "female", fetch = FetchType.LAZY)
    private FaceChat faceChatAsFemale;

    public void increaseMatchingCount(){
        totalMatchingCount++;
    }
}
