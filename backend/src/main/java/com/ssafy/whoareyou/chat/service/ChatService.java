package com.ssafy.whoareyou.chat.service;

import com.ssafy.whoareyou.chat.dto.ReceivingMessage;
import com.ssafy.whoareyou.chat.dto.SendingMessage;
import com.ssafy.whoareyou.chat.entity.Chat;
import com.ssafy.whoareyou.chat.entity.ChatRoom;
import com.ssafy.whoareyou.chat.repository.ChatJpaRepository;
import com.ssafy.whoareyou.chat.repository.ChatRoomJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatRoomService chatRoomService;
    private final ChatRoomJpaRepository chatRoomJpaRepository;
    private final ChatJpaRepository chatJpaRepository;

    public SendingMessage send(int roomId, ReceivingMessage receivingMessage){
        LocalTime now = LocalTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        String formattedTime = now.format(formatter);

        SendingMessage message = SendingMessage.builder()
                .sender(receivingMessage.getNickname())
                .message(receivingMessage.getMessage())
                .time(formattedTime)
                .build();

        ChatRoom chatRoom = chatRoomJpaRepository.findById(roomId).orElse(chatRoomService.get(roomId));
        Chat chat = Chat.builder()
                .nickname(receivingMessage.getNickname())
                .message(receivingMessage.getMessage())
                .time(formattedTime)
                .chatRoom(chatRoom)
                .build();

        chatJpaRepository.save(chat);
//        chatRoom.setHistory(chatRoom.getHistory() + "NEW_MESSAGE" + receivingMessage.getMessage());
//        chatRoomJpaRepository.save(chatRoom);

        return message;
    }
}
