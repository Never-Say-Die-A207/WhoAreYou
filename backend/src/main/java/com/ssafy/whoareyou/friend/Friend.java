package com.ssafy.whoareyou.friend;

import com.ssafy.whoareyou.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
public class Friend {
    @Id @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_id")
    private User from;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_id")
    private User to;

    private LocalDateTime createdAt;

    public static Friend createFriend(User from, User to){
        Friend friend = new Friend();
        friend.setFrom(from);
        friend.setTo(to);
        friend.setCreatedAt(LocalDateTime.now());

        return friend;
    }
}
