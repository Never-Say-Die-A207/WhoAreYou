package com.ssafy.whoareyou.user;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
    private int matchingNum;

    @OneToMany(mappedBy = "from", cascade = CascadeType.ALL)
    private List<Friend> friends = new ArrayList<>();
}
