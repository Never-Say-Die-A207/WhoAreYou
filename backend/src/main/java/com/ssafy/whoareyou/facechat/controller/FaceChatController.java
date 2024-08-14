package com.ssafy.whoareyou.facechat.controller;

import com.ssafy.whoareyou.facechat.dto.FaceChatInfoResponse;
import com.ssafy.whoareyou.facechat.dto.FaceChatRequest;
import com.ssafy.whoareyou.facechat.dto.FaceChatResultRequest;
import com.ssafy.whoareyou.facechat.exception.FaceChatNotFoundException;
import com.ssafy.whoareyou.facechat.service.FaceChatService;
import com.ssafy.whoareyou.user.exception.InvalidGenderException;
import com.ssafy.whoareyou.user.exception.UserNotFoundException;
import io.livekit.server.AccessToken;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/facechat")
@RequiredArgsConstructor
public class FaceChatController {
    private static final Logger log = LoggerFactory.getLogger(FaceChatController.class);
    private final FaceChatService faceChatService;

    //TODO : 컨트롤러에서 Wrapper Class로 입력받은 매개변수들이 null인지 확인한다

    /**
         * @param params {@link FaceChatRequest}
     * @return {@link ResponseEntity}
     */
    @PostMapping("/")
    public ResponseEntity<?> enter(@RequestBody FaceChatRequest params) {
        Integer userId = params.getUserId();
        String mask = params.getMask();
        Boolean needsChange = params.getChange();

        if(needsChange == null)
            needsChange = false;

        try {
            AccessToken token = faceChatService.getToken(userId, mask, needsChange);
            return new ResponseEntity<Map<String, String>> (Map.of("token", token.toJwt()), HttpStatus.OK);
        } catch (UserNotFoundException | InvalidGenderException e) {
            return new ResponseEntity<String>("Wrong user info.", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.info(e.getMessage());
            return new ResponseEntity<Void> (HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> quit(@PathVariable("userId") Integer userId){
        try{
            faceChatService.quitUser(userId);
            return new ResponseEntity<Void>(HttpStatus.OK);
        } catch (FaceChatNotFoundException e) {
            return new ResponseEntity<String>("Not on face chat now.", HttpStatus.OK);
        } catch (UserNotFoundException | InvalidGenderException e){
            return new ResponseEntity<String> ("Wrong user info.", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.info(e.getMessage());
            return new ResponseEntity<Void> (HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/info/{userId}")
    public ResponseEntity<?> getInfo(@PathVariable("userId") Integer userId){
        try{
            FaceChatInfoResponse infoResponse = faceChatService.getInfo(userId);
            return new ResponseEntity<Map<String, Object>>(Map.of(
                    "info", infoResponse
            ),HttpStatus.OK);
        } catch (UserNotFoundException e){
            log.info("Wrong user info");
            return new ResponseEntity<Void> (HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.info(e.getMessage());
            return new ResponseEntity<Void> (HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/list/{userId}")
    public ResponseEntity<?> getList(@PathVariable("userId") Integer userId){
        try{
            Integer totalFaceChatCount = faceChatService.countAllFaceChat();
            Integer availableFaceChatCount = faceChatService.countAllAvailableFaceChat(userId);
            return new ResponseEntity<Map<String, Integer>>(Map.of(
                    "total", totalFaceChatCount,
                    "available", availableFaceChatCount
            ),HttpStatus.OK);
        } catch (UserNotFoundException e){
            log.info("Wrong user info");
            return new ResponseEntity<Void> (HttpStatus.BAD_REQUEST);
        }  catch (Exception e){
            log.info(e.getMessage());
            return new ResponseEntity<Void> (HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/seconds/{roomId}")
    public ResponseEntity<?> getSeconds(@PathVariable("roomId") Integer roomId){
        try{
            if(roomId == null)
                return new ResponseEntity<Void> (HttpStatus.BAD_REQUEST);
            int seconds = faceChatService.getSeconds(roomId);
            log.info("getSeconds: seconds = " + seconds);
            if(seconds < 0)
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            return new ResponseEntity<Map<String, Integer>>(Map.of("seconds", seconds),HttpStatus.OK);
        } catch (Exception e){
            log.info("FaceChatController.getSeconds : Room not found");
            return new ResponseEntity<Void> (HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/friend")
    public ResponseEntity<?> addFriend(@RequestBody FaceChatResultRequest params) {
        Integer roomId = params.getRoomId();
        Integer myId = params.getMyId();
        Integer partnerId = params.getPartnerId();
        Boolean friend = params.getFriend();

        try {
            log.info("Finish face chat");

            if (friend == null)
                friend = false;

            faceChatService.updateWantsFriend(roomId, myId, partnerId, friend);
            return new ResponseEntity<Void> (HttpStatus.OK);
        } catch (UserNotFoundException e){
            log.info("Wrong user info");
            return new ResponseEntity<String> (HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.info(e.getMessage());
            return new ResponseEntity<Void> (HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
