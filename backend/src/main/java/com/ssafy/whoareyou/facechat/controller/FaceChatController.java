package com.ssafy.whoareyou.facechat.controller;

import com.ssafy.whoareyou.facechat.dto.FaceChatInfoResponse;
import com.ssafy.whoareyou.facechat.dto.FaceChatRequest;
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
@RequestMapping("/facechat")
@RequiredArgsConstructor
public class FaceChatController {
    private static final Logger log = LoggerFactory.getLogger(FaceChatController.class);
    private final FaceChatService faceChatService;
    
    //post 하나로 처리
    @PostMapping("/")
    public ResponseEntity<?> enter(@RequestBody FaceChatRequest params) {
        Integer userId = params.getUserId();
        String mask = params.getMask();
        Boolean needsChange = params.getNeedsChange();

        if(needsChange == null)
            needsChange = false;

        try {
            AccessToken token = faceChatService.getToken(userId, mask, needsChange);
            return new ResponseEntity<Map<String, String>> (Map.of("token", token.toJwt()), HttpStatus.OK);
        } catch (UserNotFoundException | InvalidGenderException e) {
            return new ResponseEntity<String>("회원 정보가 잘못 되었습니다.", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<Void> (HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> quit(@PathVariable("userId") Integer userId){
        try{
            faceChatService.quitUser(userId);
            return new ResponseEntity<Void>(HttpStatus.OK);
        } catch (FaceChatNotFoundException e) {
            return new ResponseEntity<String>("화상채팅 중이 아닙니다.", HttpStatus.OK);
        } catch (UserNotFoundException | InvalidGenderException e){
            return new ResponseEntity<String> ("회원 정보가 잘못 되었습니다.", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<Void> (HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/info/{userId}")
    public ResponseEntity<?> getInfo(@PathVariable("userId") Integer userId){

        try{
            FaceChatInfoResponse infoResponse = faceChatService.getInfo(userId);
            return new ResponseEntity<Map<String, Object>>(Map.of("info", infoResponse),HttpStatus.OK);
        } catch (UserNotFoundException e){
            return new ResponseEntity<String> ("회원 정보가 잘못 되었습니다.", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<Void> (HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
