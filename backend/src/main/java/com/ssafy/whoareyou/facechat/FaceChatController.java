package com.ssafy.whoareyou.facechat;

import io.livekit.server.AccessToken;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/facechat")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class FaceChatController {
    private final FaceChatService faceChatService;

    @PostMapping("/")
    public ResponseEntity<?> firstEnter(@RequestBody FaceChatRequest params){
        Integer userId = params.getUserId();
        String mask = params.getMask();

        if(userId == null)
            return new ResponseEntity<Void> (HttpStatus.BAD_REQUEST);

        AccessToken token = faceChatService.getFirstToken(userId, mask);
        if(token == null)
            return new ResponseEntity<Void> (HttpStatus.INTERNAL_SERVER_ERROR);

        return new ResponseEntity<Map<String, String>> (Map.of("token", token.toJwt()), HttpStatus.OK);
    }

    @PatchMapping("/")
    public ResponseEntity<?> nonFirstEnter(@RequestBody FaceChatRequest params){
        Integer userId = params.getUserId();
        String mask = params.getMask();

        if(userId == null)
            return new ResponseEntity<Void> (HttpStatus.BAD_REQUEST);

        Integer faceChatId = faceChatService.removeUser(userId);
        AccessToken token = faceChatService.getOtherToken(userId, mask, faceChatId);
        if(token == null)
            return new ResponseEntity<Void> (HttpStatus.INTERNAL_SERVER_ERROR);

        return new ResponseEntity<Map<String, String>> (Map.of("token", token.toJwt()), HttpStatus.OK);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> quit(@PathVariable("userId") Integer userId){
        if(userId == null)
            return new ResponseEntity<Void> (HttpStatus.BAD_REQUEST);

        faceChatService.removeUser(userId);

        return new ResponseEntity<Void>(HttpStatus.OK);
    }
}
