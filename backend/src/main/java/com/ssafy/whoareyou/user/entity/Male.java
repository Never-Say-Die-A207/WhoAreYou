package com.ssafy.whoareyou.user.entity;

import com.ssafy.whoareyou.facechat.entity.FaceChat;
import com.ssafy.whoareyou.facechat.entity.History;
import com.ssafy.whoareyou.friend.entity.Friend;
import com.ssafy.whoareyou.user.dto.request.auth.SignUpRequestDto;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("male")
public class Male extends User {

    @OneToOne(mappedBy = "male", fetch = FetchType.LAZY)
    private FaceChat faceChatAsMale;

    @OneToMany(mappedBy = "male")
    private List<History> historiesAsMale = new ArrayList<>();

    @OneToMany(mappedBy = "male")
    private List<Friend> friendsAsMale = new ArrayList<>();

    public Male(SignUpRequestDto dto) {
        super(dto);
    }

    public Male(String email, String name, String nickname, String type) {
        super(email, name, nickname, type);
    }
}
