package com.ssafy.whoareyou.chat.controller;

import com.ssafy.whoareyou.chat.dto.SearchTargetChatRoom;
import com.ssafy.whoareyou.chat.service.ChatRoomService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chat-rooms")
@RequiredArgsConstructor
public class ChatRoomController {
    static int cnt = 11;
    private final ChatRoomService service;

    /**
     * 기준이 되는 사용자와 채팅 대상이 되는 사용자의 채팅방을 찾기 위한 API.
     * 각 사용자의 PK를 통해 INTERSECT 되는 ChatRoom을 찾아 History를 DELIM을
     * 통해 나눈 뒤 List 형태로 return.
     * @param dto
     * @return List<String>
     */
    @PostMapping("/historys")
    public ResponseEntity<?> loadHistory(@RequestBody SearchTargetChatRoom dto){
        return new ResponseEntity<>(service.loadHistorys(dto), HttpStatus.OK);
    }

    /**
     * User가 가지고 있는 Relation 목록을 보여주는 API
     * 쓸 일이 없을 것 같지만 일단 만들어둠
     */
//    @GetMapping("/{userId}")
//    public ResponseEntity<?> list(@PathVariable("userId") int userId){
//        return new ResponseEntity<>(service.getRooms(userId), HttpStatus.OK);
//    }

    /**
     * ChatRoomDto를 통해 기존에 존재하는 ChatRoom을 조회하기 위함.
     * ChatRoomDto의 roomId가 -1이라면
     * 새로운 방을 만들고 해당 방의 PK를 return.
     * 이미 존재한 방이 있다면 해당 방의 PK를 return.
     * @param roomId
     * @return ChatRoom PK(기본키)
     */
    @PostMapping("/{roomId}")
    public ResponseEntity<?> get(@PathVariable("roomId") int roomId){
        return new ResponseEntity<>(service.get(roomId).getId(), HttpStatus.CREATED);
    }

    /**
     * 사용자와 roomId에 해당하는 ChatRoom의 Relation을 만들기 위한 API.
     * 만들어진 Relation은 사용자와 ChatRoom의 다대다 관계를 중재하는 조인 테이블.
     * @param roomId
     * @return HttpStatus.OK(200)
     */
    @PostMapping("/relations/{roomId}")
    public ResponseEntity<?> join(@PathVariable int roomId, @RequestBody SearchTargetChatRoom dto){
        service.join(roomId, dto);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
