//package com.ssafy.whoareyou.friend.service;
//
//import com.ssafy.whoareyou.facechat.entity.FaceChat;
//import com.ssafy.whoareyou.entity.Friend;
//import com.ssafy.whoareyou.friend.dto.FriendResponse;
//import com.ssafy.whoareyou.friend.repository.FriendRepository;
//import com.ssafy.whoareyou.user.entity.User;
//import com.ssafy.whoareyou.facechat.repository.FaceChatRepository;
//import com.ssafy.whoareyou.user.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@Service
//@Transactional
//@RequiredArgsConstructor
//public class FriendService {
//    private final FriendRepository friendRepository;
//    private final FaceChatRepository faceChatRepository;
//    private final UserRepository userRepository;
//
//    public void createFriend(int faceChatId) {
//        FaceChat faceChat = faceChatRepository.findOne(faceChatId);
//        User male = faceChat.getMale();
//        User female = faceChat.getFemale();
//
//        Friend friend = new Friend(male, faceChat.getMaleMask(), female, faceChat.getFemaleMask());
//        male.addFriend(friend);
//        female.addFriend(friend);
//
//        friendRepository.save(friend);
//        userRepository.save(male);
//        userRepository.save(female);
//    }
//
//    @Transactional(readOnly = true)
//    public List<FriendResponse> findFriends(int userId){
//        User user = userRepository.findOne(userId);
//
//        List<Friend> friends = friendRepository.findAllByGender(user);
//
//        String myGender = user.getGender();
//        List<FriendResponse> friendResponseList = new ArrayList<>();
//        for(Friend friend : friends){
//            if(myGender.equals("male")){
//                friendResponseList.add(new FriendResponse(friend.getFemale()));
//            }
//            else
//                friendResponseList.add(new FriendResponse(friend.getMale()));
//        }
//
//        return friendResponseList;
//    }
//
////    @Transactional
////    public void deleteFriend(long friendId){
////        Friend findFriend = friendRepository.findOne(friendId);
////
////        User from = findFriend.getFrom();
////        from.getFriends().remove(findFriend);
////
////        userRepository.save(from);
////
////        friendRepository.delete(findFriend);
////    }
//}
