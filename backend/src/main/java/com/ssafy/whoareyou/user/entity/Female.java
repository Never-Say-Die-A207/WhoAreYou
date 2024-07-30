package com.ssafy.whoareyou.user.entity;

import com.ssafy.whoareyou.facechat.entity.FaceChat;
import com.ssafy.whoareyou.facechat.entity.History;
import com.ssafy.whoareyou.friend.entity.Friend;
import com.ssafy.whoareyou.user.dto.request.auth.SignUpRequestDto;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Builder
@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("female")
public class Female extends User {
    @OneToOne(mappedBy = "female", fetch = FetchType.LAZY)
    private FaceChat faceChatAsFemale;

    @OneToMany(mappedBy = "female")
    private List<History> historiesAsFemale = new ArrayList<>();

    @OneToMany(mappedBy = "female")
    private List<Friend> friendsAsFemale = new ArrayList<>();

    public Female(SignUpRequestDto dto) {
        super(dto);
    }

    public Female(String email, String name, String nickname, String type) {
        super(email, name, nickname, type);
    }
}
