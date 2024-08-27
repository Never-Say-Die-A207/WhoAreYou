package com.ssafy.whoareyou.chat.entity;

import com.ssafy.whoareyou.chat.entity.mongo.Chat;
import com.ssafy.whoareyou.friend.entity.Friend;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "chat_room")
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToMany(mappedBy = "chatRoom")
    private List<Friend> friends;
}
