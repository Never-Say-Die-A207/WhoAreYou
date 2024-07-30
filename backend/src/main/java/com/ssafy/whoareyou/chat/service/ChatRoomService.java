package com.ssafy.whoareyou.chat.service;

import com.ssafy.whoareyou.chat.dto.SearchTargetChatRoom;
import com.ssafy.whoareyou.chat.dto.SendingMessage;
import com.ssafy.whoareyou.chat.entity.Chat;
import com.ssafy.whoareyou.chat.entity.ChatRoom;
import com.ssafy.whoareyou.chat.repository.ChatJpaRepository;
import com.ssafy.whoareyou.chat.repository.ChatRoomJpaRepository;
import com.ssafy.whoareyou.friend.repository.FriendJpaRepository;
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
    private final ChatRoomJpaRepository chatRoomJpaRepository;
    private final ChatJpaRepository chatJpaRepository;
    private final FriendJpaRepository friendJpaRepository;

    public List<SendingMessage> loadHistorys(SearchTargetChatRoom dto){
        int maleId = dto.getMaleId();
        int femaleId = dto.getFemaleId();

        ChatRoom chatRoom = friendJpaRepository.findByGenderId(maleId, femaleId).orElseThrow(
                () -> new NullPointerException("존재하지 않은 친구관계")
        ).getChatRoom();
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

    public ChatRoom create(){
        return chatRoomJpaRepository.save(ChatRoom.builder().build());
    }
}
