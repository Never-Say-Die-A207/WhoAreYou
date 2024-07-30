package com.ssafy.whoareyou.friend.controller;

import com.ssafy.whoareyou.chat.dto.SearchTargetChatRoom;
import com.ssafy.whoareyou.chat.service.ChatRoomService;
import com.ssafy.whoareyou.friend.service.FriendService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/friends")
@RequiredArgsConstructor
public class FriendController {
    private final FriendService service;

    @GetMapping("/")
    ResponseEntity<?> getList(HttpServletRequest request){
        int userId = Integer.parseInt((String) request.getAttribute("userId"));

        return new ResponseEntity<>(service.getList(userId), HttpStatus.OK);
    }

    /**
     * 사용자와 roomId에 해당하는 ChatRoom의 Relation을 만들기 위한 API.
     * 만들어진 Relation은 사용자와 ChatRoom의 다대다 관계를 중재하는 조인 테이블.
     * @param roomId
     * @return HttpStatus.OK(200)
     */
    @PostMapping("/{roomId}")
    ResponseEntity<?> join(@PathVariable int roomId, @RequestBody SearchTargetChatRoom dto){
        service.join(roomId, dto);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
