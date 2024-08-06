package com.ssafy.whoareyou.chat.service;

import com.ssafy.whoareyou.friend.entity.SearchTargetDto;
import com.ssafy.whoareyou.chat.dto.SendingMessage;
import com.ssafy.whoareyou.chat.entity.mongo.Chat;
import com.ssafy.whoareyou.chat.entity.ChatRoom;
import com.ssafy.whoareyou.chat.repository.ChatMongoRepository;
import com.ssafy.whoareyou.chat.repository.ChatRoomJpaRepository;
import com.ssafy.whoareyou.friend.entity.Friend;
import com.ssafy.whoareyou.friend.repository.FriendJpaRepository;
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
    private final UserRepository userRepository;
    private final ChatRoomJpaRepository chatRoomJpaRepository;
    private final ChatMongoRepository chatMongoRepository;
    private final FriendJpaRepository friendJpaRepository;

    public int getChatRoomId(int userId, String nickname){
        log.info("getChatRoomId 시작");
        
        log.info("사용자 정보 불러오기");
        User other = userRepository.findByNickname(nickname).orElseThrow(() -> new NullPointerException("존재하지 않은 유저"));

        log.info("친구관계 불러오기");
        Friend friend = (other instanceof Male ? friendJpaRepository.findByGenderId(other.getId(), userId) : friendJpaRepository.findByGenderId(userId, other.getId()))
                .orElseThrow(() -> new NullPointerException("존재하지 않은 친구관계"));

        log.info("채팅방 가져오기");
        ChatRoom chatRoom = friend.getChatRoom();

        log.info("채팅방 NullPointerException 확인");
        if(chatRoom == null)
            throw new NullPointerException("존재하지 않은 채팅방");

        log.info("getChatRoomId 종료");
        return chatRoom.getId();
    }

    public List<SendingMessage> loadHistorys(SearchTargetDto dto){
        log.info("loadHistory 시작");
        boolean isMale = userRepository.findById(dto.getMaleId()).get() instanceof Male;

        int maleId = isMale ? dto.getMaleId() : dto.getFemaleId();
        int femaleId = isMale ? dto.getFemaleId() : dto.getMaleId();

        ChatRoom chatRoom = friendJpaRepository.findByGenderId(maleId, femaleId).orElseThrow(
                () -> new NullPointerException("존재하지 않은 친구관계")
        ).getChatRoom();
        
        log.info("채팅내역 가져오기");
        List<Chat> chats = chatMongoRepository.findByRoomId(chatRoom.getId());

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

        log.info("loadHistory 종료");
        return sendingMessages;
    }

    public ChatRoom create(){
        log.info("새로운 채팅방 생성");
        return chatRoomJpaRepository.save(ChatRoom.builder().build());
    }
}
