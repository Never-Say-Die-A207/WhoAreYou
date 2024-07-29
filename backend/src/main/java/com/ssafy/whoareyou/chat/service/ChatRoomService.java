package com.ssafy.whoareyou.chat.service;

import com.ssafy.whoareyou.chat.dto.SearchTargetChatRoom;
import com.ssafy.whoareyou.chat.dto.SendingMessage;
import com.ssafy.whoareyou.chat.entity.Chat;
import com.ssafy.whoareyou.friend.entity.Friend;
import com.ssafy.whoareyou.chat.entity.ChatRoom;
import com.ssafy.whoareyou.chat.repository.ChatJpaRepository;
import com.ssafy.whoareyou.chat.repository.ChatRoomJpaRepository;
import com.ssafy.whoareyou.friend.repository.FriendJpaRepository;
import com.ssafy.whoareyou.user.entity.Female;
import com.ssafy.whoareyou.user.entity.Male;
import com.ssafy.whoareyou.user.entity.User;
import com.ssafy.whoareyou.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ChatRoomService {
    private final UserRepository userJpaRepository;
    private final ChatRoomJpaRepository chatRoomJpaRepository;
    private final ChatJpaRepository chatJpaRepository;
    private final FriendJpaRepository friendJpaRepository;

    public List<SendingMessage> loadHistorys(SearchTargetChatRoom dto){
        int maleId = dto.getMaleId();
        int femaleId = dto.getFemaleId();

        ChatRoom chatRoom = friendJpaRepository.findByGenderId(maleId, femaleId).get().getChatRoom();
        List<Chat> chats = chatJpaRepository.findByRoomId(chatRoom.getId());

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

//    public List<Friend> getRooms(int userId){
//        return friendJpaRepository.findListByUserId(userId);
//    }

    public ChatRoom get(int roomId){
        ChatRoom chatRoom = find(roomId);

        if(chatRoom != null)
            return chatRoom;

        chatRoom = ChatRoom.builder()
                .build();

        return chatRoomJpaRepository.save(chatRoom);
    }

    public String join(int roomId, SearchTargetChatRoom dto){
        Optional<ChatRoom> chatRoom = chatRoomJpaRepository.findById(roomId);
        User male = userJpaRepository.findById(dto.getMaleId()).get();
        User female = userJpaRepository.findById(dto.getFemaleId()).get();

        if(chatRoom.isEmpty())
            return "비어있음";

        if(chatRoomJpaRepository.findByGenderId(male.getId(), female.getId()).isPresent()) {
            log.info("ㅋㅋ 이미 있음");
            return "이미 있음";
        }

        setRelation(chatRoom.get(), (Male) male, (Female) female);

        return "친구추가 됨 ㅋㅋ";
    }

    public ChatRoom find(int roomId){
        return chatRoomJpaRepository.findById(roomId).orElse(null);
    }

    public void setRelation(ChatRoom chatRoom, Male male, Female female){
        Friend friend = Friend.builder()
                .male(male)
                .female(female)
                .chatRoom(chatRoom)
                .build();

        friendJpaRepository.save(friend);
    }

    public void deleteRelation(ChatRoom chatRoom, User user){
//        userJpaRepository.deleteByIds(user.getId(), chatRoom.getId());
    }
}
