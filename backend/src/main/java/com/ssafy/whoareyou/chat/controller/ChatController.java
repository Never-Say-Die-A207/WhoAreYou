package com.ssafy.whoareyou.chat.controller;

import com.ssafy.whoareyou.chat.dto.ReceivingMessage;
import com.ssafy.whoareyou.chat.dto.SendingMessage;
import com.ssafy.whoareyou.chat.service.ChatService;
import com.ssafy.whoareyou.chat.service.kafka.KafkaConumerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatController {
    private final KafkaConumerService kafkaConumerService;
    private final ChatService service;

    /**
     * MessageMapping을 통해 /pub/rooms/{roomId}에서 Message를 Send.
     * roomId에 해당하는 WebSocket연결이 있다면 해당 경로인 /sub/rooms/{roomId}에
     * Message 발행.
     *
     * 그 사이에 roomId에 해당하는 ChatRoom의 History에 ReceivingMessage의 Message를 저장.
     *
     * SendingMessage를 통해 Sender, Message, Time을 각각 JSON 형태로 return.
     * @param message
     * @return
     */
    @MessageMapping("/messages")
    public ResponseEntity<?> chat(ReceivingMessage message){
        log.info("소켓 시작");
        log.info("roomId" + message.getRoomId());
        SendingMessage result = service.send(message);
        kafkaConumerService.listen(message.getRoomId(), result);

        log.info("소켓 종료");
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
