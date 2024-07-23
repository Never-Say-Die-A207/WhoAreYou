package com.ssafy.whoareyou.facechat;

import com.ssafy.whoareyou.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
public class FaceChat {

    @Id @GeneratedValue
    private int id;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @OneToOne
    @JoinColumn(name="host_id")
    private User host;

    public static FaceChat createRoom(User user){
        FaceChat room = new FaceChat();
        room.setHost(user);
        room.setCreatedAt(LocalDateTime.now());
        return room;
    }
}
