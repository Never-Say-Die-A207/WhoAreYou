package com.ssafy.whoareyou.chat.service.kafka;

import com.ssafy.whoareyou.chat.dto.ReceivingMessage;
import com.ssafy.whoareyou.chat.dto.SendingMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaConumerService {
    private final SimpMessagingTemplate messagingTemplate;

//    @KafkaListener(topics = "chat-topic", groupId = "chat-group")
//    public void listen(int roomId, SendingMessage message){
//        messagingTemplate.convertAndSend("/sub/rooms/" + roomId, message);
//    }
}
