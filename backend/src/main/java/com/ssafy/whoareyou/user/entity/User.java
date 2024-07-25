package com.ssafy.whoareyou.user.entity;

import com.ssafy.whoareyou.friend.entity.Friend;
import com.ssafy.whoareyou.facechat.entity.History;
import com.ssafy.whoareyou.facechat.entity.FaceChat;
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

//    @OneToMany(mappedBy = "male", cascade = CascadeType.REMOVE)
//    private List<Friend> friendsAsMale = new ArrayList<>();
//
//    @OneToMany(mappedBy = "female", cascade = CascadeType.REMOVE)
//    private List<Friend> friendsAsFemale = new ArrayList<>();
//
//    public void addFriend(Friend friend) {
//        if(this.gender.equals("male")) {
//            this.friendsAsMale.add(friend);
//        }
//        else {
//            this.friendsAsFemale.add(friend);
//        }
//    }
    @OneToMany(mappedBy = "user")
    private List<Friend> friends;

    @OneToOne(mappedBy = "male", fetch = FetchType.LAZY)
    private FaceChat faceChatAsMale;

    @OneToOne(mappedBy = "female", fetch = FetchType.LAZY)
    private FaceChat faceChatAsFemale;

    @OneToMany(mappedBy = "id")
    private List<History> recentFaceChats = new ArrayList<>();

    public void increaseMatchingCount(){
        totalMatchingCount++;
    }
}
