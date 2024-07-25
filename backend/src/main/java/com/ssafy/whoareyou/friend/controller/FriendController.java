//package com.ssafy.whoareyou.friend.controller;
//
//import com.ssafy.whoareyou.friend.dto.FriendResponse;
//import com.ssafy.whoareyou.friend.service.FriendService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/friend")
//@RequiredArgsConstructor
//public class FriendController {
//    private final FriendService friendService;
//
//    @GetMapping("/list/{userId}")
//    public ResponseEntity<?> listFriend(@PathVariable("userId") Integer userId){
//        if(userId == null)
//            return new ResponseEntity<Void>(HttpStatus.BAD_REQUEST);
//
//        List<FriendResponse> friendResponseList = friendService.findFriends(userId);
//        if(friendResponseList.isEmpty())
//            return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
//
//        return new ResponseEntity<>(friendResponseList, HttpStatus.OK);
//    }
//
//    @PostMapping("")
//    public ResponseEntity<?> createFriend(@RequestBody Map<String, Integer> params){
//        Integer faceChatId = params.get("faceChatId");
//        if(faceChatId == null)
//            return new ResponseEntity<Void>(HttpStatus.BAD_REQUEST);
//
//        try{
//            friendService.createFriend(faceChatId);
//            return new ResponseEntity<Void>(HttpStatus.CREATED);
//        } catch (Exception e){
//            return new ResponseEntity<Void>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
////    @DeleteMapping("/{friendId}")
////    public ResponseEntity<?> deleteFriend(@PathVariable("friendId") Long friendId){
////        if(friendId == null)
////            return new ResponseEntity<Void>(HttpStatus.BAD_REQUEST);
////
////        try{
////            friendService.deleteFriend(friendId);
////            return new ResponseEntity<Void>(HttpStatus.OK);
////        } catch (Exception e){
////            return new ResponseEntity<Void>(HttpStatus.INTERNAL_SERVER_ERROR);
////        }
////    }
//}
