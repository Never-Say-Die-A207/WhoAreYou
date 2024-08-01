package com.ssafy.whoareyou.chat.controller;

import com.ssafy.whoareyou.chat.dto.SearchTargetChatRoom;
import com.ssafy.whoareyou.chat.service.ChatRoomService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chat-rooms")
@RequiredArgsConstructor
public class ChatRoomController {
    private final ChatRoomService service;

    @GetMapping("/{nickname}")
    public ResponseEntity<?> getChatRoom(HttpServletRequest request, @PathVariable("nickname") String nickname){
        int userId = Integer.parseInt(request.getHeader(HttpHeaders.AUTHORIZATION));
        return new ResponseEntity<>(service.getChatRoomId(userId, nickname), HttpStatus.OK);
    }

    /**
     * 기준이 되는 사용자와 채팅 대상이 되는 사용자의 채팅방을 찾기 위한 API.
     * 각 사용자의 PK를 통해 INTERSECT 되는 ChatRoom을 찾아 History를 DELIM을
     * 통해 나눈 뒤 List 형태로 return.
     * @param dto
     * @return List<String>
     */    @PostMapping("/historys")
    public ResponseEntity<?> loadHistory(@RequestBody SearchTargetChatRoom dto){
        return new ResponseEntity<>(service.loadHistorys(dto), HttpStatus.OK);
    }
}
