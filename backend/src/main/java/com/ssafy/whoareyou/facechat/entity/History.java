package com.ssafy.whoareyou.facechat.entity;

import com.ssafy.whoareyou.user.entity.Female;
import com.ssafy.whoareyou.user.entity.Male;
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
    @JoinColumn(name = "male_id")
    private Male male;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "female_id")
    private Female female;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id")
//    private User user;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "facechat_id")
//    private FaceChat faceChat;

    private LocalDateTime enteredAt;

    public History(Male male, Female female, LocalDateTime now) {
        this.male = male;
        this.female = female;
        this.enteredAt = now;
    }
}
