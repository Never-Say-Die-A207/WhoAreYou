package com.ssafy.whoareyou.chat.controller;

import com.ssafy.whoareyou.chat.dto.ReceivingMessage;
import com.ssafy.whoareyou.chat.dto.SendingMessage;
import com.ssafy.whoareyou.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
public class ChatController {
    private final ChatService service;

    /**
     * MessageMapping을 통해 /pub/rooms/{roomId}에서 Message를 Send.
     * roomId에 해당하는 WebSocket연결이 있다면 해당 경로인 /sub/rooms/{roomId}에
     * Message 발행.
     *
     * 그 사이에 roomId에 해당하는 ChatRoom의 History에 ReceivingMessage의 Message를 저장.
     *
     * SendingMessage를 통해 Sender, Message, Time을 각각 JSON 형태로 return.
     * @param roomId
     * @param message
     * @return
     */
    @MessageMapping("/rooms/{roomId}")
    @SendTo("/sub/rooms/{roomId}")
    public ResponseEntity<?> chat(@DestinationVariable(value = "roomId") String roomId, ReceivingMessage message){
        SendingMessage result = service.send(Integer.parseInt(roomId), message);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    // 2024/07/03 방 나누는 거 하는 중~~
}