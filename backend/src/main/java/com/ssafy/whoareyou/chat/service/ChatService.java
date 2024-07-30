package com.ssafy.whoareyou.chat.service;

import com.ssafy.whoareyou.chat.dto.ReceivingMessage;
import com.ssafy.whoareyou.chat.dto.SendingMessage;
import com.ssafy.whoareyou.chat.entity.Chat;
import com.ssafy.whoareyou.chat.entity.ChatRoom;
import com.ssafy.whoareyou.chat.repository.ChatJpaRepository;
import com.ssafy.whoareyou.chat.repository.ChatRoomJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatRoomService chatRoomService;
    private final ChatRoomJpaRepository chatRoomJpaRepository;
    private final ChatJpaRepository chatJpaRepository;

    @Transactional
    public SendingMessage send(int roomId, ReceivingMessage receivingMessage){
        LocalTime now = LocalTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        String formattedTime = now.format(formatter);

        SendingMessage message = SendingMessage.builder()
                .sender(receivingMessage.getNickname())
                .message(receivingMessage.getMessage())
                .time(formattedTime)
                .build();

        ChatRoom chatRoom = chatRoomJpaRepository.findById(roomId).orElse(chatRoomService.create());
        Chat chat = Chat.builder()
                .nickname(receivingMessage.getNickname())
                .message(receivingMessage.getMessage())
                .time(formattedTime)
                .chatRoom(chatRoom)
                .build();

        log.info("채팅내역 저장 완료");
        chatJpaRepository.save(chat);

        return message;
    }
}
