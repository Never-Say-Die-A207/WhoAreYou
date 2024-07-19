package com.ssafy.whoareyou.friend;

import com.ssafy.whoareyou.user.User;
import com.ssafy.whoareyou.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/friend")
@RequiredArgsConstructor
public class FriendController {
    private final FriendService friendService;

    private final UserRepository userRepository;

    @GetMapping("/test/{userName}")
    public ResponseEntity<Void> test(@PathVariable("userName") String name){
        User user = new User();
        user.setName(name);

        userRepository.save(user);
        return new ResponseEntity<Void>(HttpStatus.CREATED);
    }

    @GetMapping("/list/{userId}")
    public ResponseEntity<?> listFriend(@PathVariable("userId") Integer userId){
        if(userId == null)
            return new ResponseEntity<Void>(HttpStatus.BAD_REQUEST);

        List<FriendResponseDto> friendResponseDtoList = friendService.findFriends(userId);
        if(friendResponseDtoList.isEmpty())
            return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);

        return new ResponseEntity<>(friendResponseDtoList, HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<?> addFriend(@RequestBody Map<String, Integer> params){
        Integer fromId = params.get("fromId");
        Integer toId = params.get("toId");
        if(fromId == null || toId == null)
            return new ResponseEntity<Void>(HttpStatus.BAD_REQUEST);

        try{
            friendService.addFriend(fromId, toId);
            return new ResponseEntity<Void>(HttpStatus.CREATED);
        } catch (Exception e){
            return new ResponseEntity<Void>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{friendId}")
    public ResponseEntity<?> deleteFriend(@PathVariable("friendId") Long friendId){
        if(friendId == null)
            return new ResponseEntity<Void>(HttpStatus.BAD_REQUEST);

        try{
            friendService.deleteFriend(friendId);
            return new ResponseEntity<Void>(HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<Void>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
