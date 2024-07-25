package com.ssafy.whoareyou.user.entity;

import com.ssafy.whoareyou.dto.request.auth.SignUpRequestDto;
import com.ssafy.whoareyou.facechat.entity.FaceChat;
import com.ssafy.whoareyou.facechat.entity.History;
import com.ssafy.whoareyou.friend.entity.Friend;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name="user")
@Table(name="user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(length = 255)
    private String password;

    @Column(nullable = false, length = 20)
    private String name;

    @Column(nullable = false, length = 20)
    private String nickname;

    @Column(nullable = false, length = 20)
    private String gender;

    @Column(name = "total_matching_count", nullable = false, columnDefinition = "int default 0")
    private int totalMatchingCount;

    @Column(nullable = false, length = 10)
    private String type; //"general", "kakao", "naver"

    @OneToOne(mappedBy = "male", fetch = FetchType.LAZY)
    private FaceChat faceChatAsMale;

    @OneToOne(mappedBy = "female", fetch = FetchType.LAZY)
    private FaceChat faceChatAsFemale;

    @OneToMany(mappedBy = "id")
    private List<History> recentFaceChats = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<Friend> friends;

    public User(SignUpRequestDto dto){
        this.email = dto.getEmail();
        this.password = dto.getPassword();
        this.name = dto.getName();
        this.nickname = dto.getNickname();
        this.gender = dto.getGender();
        this.totalMatchingCount = 0;
        this.type = "general";
    }

    public User(String email, String name, String nickname, String gender, String type){
        this.email = email;
        this.name = name;
        this.nickname = nickname;
        this.gender = gender;
        this.totalMatchingCount = 0;
        this.type = type;
    }

    public void increaseMatchingCount(){
        totalMatchingCount++;
    }
}
