package com.ssafy.whoareyou.facechat.entity;

import com.ssafy.whoareyou.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class History {
    @Id @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facechat_id")
    private FaceChat faceChat;

    private LocalDateTime enteredAt;

    public History(User user, FaceChat faceChat) {
        this.user = user;
        this.faceChat = faceChat;
        this.enteredAt = LocalDateTime.now();
    }
}
