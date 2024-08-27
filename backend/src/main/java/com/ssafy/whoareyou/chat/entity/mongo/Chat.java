package com.ssafy.whoareyou.chat.entity.mongo;

import com.ssafy.whoareyou.chat.entity.ChatRoom;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document("chat")
public class Chat {
    @Id
    private String id;
    private String nickname;
    private String message;
    private String time;
    private int chatRoomId;
}
