package com.ssafy.whoareyou.friend.controller;

import com.ssafy.whoareyou.friend.dto.SearchTargetDto;
import com.ssafy.whoareyou.friend.service.FriendService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
public class FriendController {
    private final FriendService service;

    @GetMapping("/")
    ResponseEntity<?> getList(HttpServletRequest request){
        int userId = Integer.parseInt((String) request.getAttribute("userId"));
        log.info("getList, userId: " + userId);

        return new ResponseEntity<>(service.getList(userId), HttpStatus.OK);
    }

    /**
     * 사용자와 roomId에 해당하는 ChatRoom의 Relation을 만들기 위한 API.
     * 만들어진 Relation은 사용자와 ChatRoom의 다대다 관계를 중재하는 조인 테이블.
     * @param dto
     * @return HttpStatus.CREATED(201)
     */
    @PostMapping("/")
    ResponseEntity<?> join(@RequestBody SearchTargetDto dto){
        return new ResponseEntity<>(service.join(dto), HttpStatus.CREATED);
    }

    @DeleteMapping("/")
    ResponseEntity<?> delete(@RequestBody SearchTargetDto dto){
        service.delete(dto);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
