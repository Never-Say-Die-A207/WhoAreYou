package com.ssafy.whoareyou.chat.service;

import com.ssafy.whoareyou.chat.dto.SearchTargetChatRoom;
import com.ssafy.whoareyou.chat.dto.SendingMessage;
import com.ssafy.whoareyou.chat.entity.Chat;
import com.ssafy.whoareyou.chat.entity.Friend;
import com.ssafy.whoareyou.chat.entity.ChatRoom;
import com.ssafy.whoareyou.chat.entity.User;
import com.ssafy.whoareyou.chat.repository.ChatJpaRepository;
import com.ssafy.whoareyou.chat.repository.ChatRoomJpaRepository;
import com.ssafy.whoareyou.chat.repository.FriendJpaRepository;
import com.ssafy.whoareyou.chat.repository.UserJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
    private final UserJpaRepository userJpaRepository;
    private final ChatRoomJpaRepository chatRoomJpaRepository;
    private final ChatJpaRepository chatJpaRepository;
    private final FriendJpaRepository friendJpaRepository;

    public List<SendingMessage> loadHistorys(SearchTargetChatRoom dto){
        int userId1 = dto.getUserId1();
        int userId2 = dto.getUserId2();

        Optional<ChatRoom> chatRoom = chatRoomJpaRepository.findByUserIds(userId1, userId2);
        List<Chat> chats = chatJpaRepository.findByRoomId(chatRoom.get().getId());

        List<SendingMessage> sendingMessages = new LinkedList<>();
        for(Chat chat : chats){
            sendingMessages.add(
                    SendingMessage.builder()
                            .sender(chat.getNickname())
                            .message(chat.getMessage())
                            .time(chat.getTime())
                            .build()
            );
        }

        return sendingMessages;
    }

    public List<Friend> getRooms(int userId){
        return friendJpaRepository.findListByUserId(userId);
    }

    public ChatRoom get(int roomId){
        ChatRoom chatRoom = find(roomId);

        if(chatRoom != null)
            return chatRoom;

        chatRoom = ChatRoom.builder()
                .build();

        return chatRoomJpaRepository.save(chatRoom);
    }

    public String join(int roomId, int userId){
        Optional<ChatRoom> chatRoom = chatRoomJpaRepository.findById(roomId);
        Optional<User> user = userJpaRepository.findById(userId);

        if(chatRoom.isEmpty())
            return "비어있음";

        if(friendJpaRepository.findByIds(user.get().getId(), chatRoom.get().getId()).isPresent())
            return "이미 있음";

        setRelation(chatRoom.get(), user.get());

        return "친구추가 됨 ㅋㅋ";
    }

    public ChatRoom find(int roomId){
        return chatRoomJpaRepository.findById(roomId).orElse(null);
    }

    public void setRelation(ChatRoom chatRoom, User user){
        Friend friend = Friend.builder()
                .user(user)
                .chatRoom(chatRoom)
                .build();

        friendJpaRepository.save(friend);
    }

    public void deleteRelation(ChatRoom chatRoom, User user){
//        userJpaRepository.deleteByIds(user.getId(), chatRoom.getId());
    }
}
