//package com.ssafy.whoareyou.facechat;
//
//import com.ssafy.whoareyou.chat.entity.ChatRoom;
//import com.ssafy.whoareyou.chat.repository.ChatRoomJpaRepository;
//import com.ssafy.whoareyou.facechat.dto.FaceChatInfoResponse;
//import com.ssafy.whoareyou.facechat.entity.FaceChat;
//import com.ssafy.whoareyou.facechat.entity.History;
//import com.ssafy.whoareyou.facechat.repository.FaceChatRepository;
//import com.ssafy.whoareyou.facechat.service.FaceChatService;
//import com.ssafy.whoareyou.friend.entity.Friend;
//import com.ssafy.whoareyou.friend.repository.FriendJpaRepository;
//import com.ssafy.whoareyou.user.entity.Female;
//import com.ssafy.whoareyou.user.entity.Male;
//import com.ssafy.whoareyou.user.repository.UserRepository;
//import jakarta.persistence.NoResultException;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//@SpringBootTest
//class FaceChatServiceTest {
//    @Autowired
//    FaceChatService faceChatService;
//
//    @Autowired
//    FaceChatRepository faceChatRepository;
//
//    @Autowired
//    UserRepository userRepository;
//
//    @Autowired
//    FriendJpaRepository friendJpaRepository;
//
//    @Autowired
//    ChatRoomJpaRepository chatRoomJpaRepository;
//
//    @Test
//    @Transactional
//    public void 동성방찾기테스트() throws Exception {
//        //given
//        /* 남자 1 2 3 존재 */
//        Male male1 = saveMale("email1", "name1", "M1", "general");
//        Male male2 = saveMale("email2", "name2", "M2", "general");
//        Male male3 = saveMale("email3", "name3", "M3", "general");
//
//        //when
//        /* 남자 1 2 3이 순서대로 매칭 시작 */
//        faceChatService.getToken(male1.getId(), "male1Mask");
//        faceChatService.getToken(male2.getId(), "male2Mask");
//        faceChatService.getToken(male3.getId(), "male3Mask");
//
//        //then
//        /* 서로 매칭되지 않고 각각의 방에서 대기 */
//        FaceChatInfoResponse info1 = faceChatService.getInfo(male1.getId());
//        FaceChatInfoResponse info2 = faceChatService.getInfo(male2.getId());
//        FaceChatInfoResponse info3 = faceChatService.getInfo(male3.getId());
//        assertArrayEquals(new int[] {1,2,3}, new int[] {info1.getId(),info2.getId(),info3.getId()});
//    }
//
//    @Test
//    @Transactional
//    public void 방찾기테스트() throws Exception {
//        //given
//        /* 남자 1 2 3이 순서대로 대기 중
//        여자 1은 남자 1과 매칭 이력이 있으며 남자 2와 친구 */
//        Male male1 = saveMale("email1", "name1", "M1", "general");
//        Male male2 = saveMale("email2", "name2", "M2", "general");
//        Male male3 = saveMale("email3", "name3", "M3", "general");
//        faceChatService.getToken(male1.getId(), "male1Mask");
//        faceChatService.getToken(male2.getId(), "male2Mask");
//        faceChatService.getToken(male3.getId(), "male3Mask");
//
//        Female female1 = saveFemale("email4", "name4", "F1", "general");
//
//        History history = new History(male1, female1, LocalDateTime.now());
//        faceChatRepository.saveFaceChatOrHistory(history);
//
//        //채팅방 만들기
//        ChatRoom chatRoom = ChatRoom.builder()
//                .build();
//        chatRoomJpaRepository.save(chatRoom);
//
//        //친구 추가 로직
//        Friend friendM2W1 = new Friend(1, "칭기칭기", male2, female1, chatRoom);
//        friendJpaRepository.save(friendM2W1);
//
//        //when
//        /* 여자 1 매칭 시작 */
//        FaceChat available = faceChatRepository.findAvailable(female1);
//
//        //then
//        /* 남자 3와 매칭 */
//        assertEquals(male3.getId(), available.getMale().getId());
//    }
//
//    @Test
//    @Transactional
//    public void 방찾기테스트2() throws Exception {
//        //given
//        /* 남자 1 2 3이 순서대로 대기 중
//        여자 1은 남자 1, 2와 매칭 이력이 있으며 남자 3과 친구 */
//        Male male1 = saveMale("email1", "name1", "M1", "general");
//        Male male2 = saveMale("email2", "name2", "M2", "general");
//        Male male3 = saveMale("email3", "name3", "M3", "general");
//        faceChatService.getToken(male1.getId(), "male1Mask");
//        faceChatService.getToken(male2.getId(), "male2Mask");
//        faceChatService.getToken(male3.getId(), "male3Mask");
//
//        Female female1 = saveFemale("email4", "name4", "F1", "general");
//
//        History history1 = new History(male1, female1, LocalDateTime.now());
//        History history2 = new History(male2, female1, LocalDateTime.now());
//        faceChatRepository.saveFaceChatOrHistory(history1);
//        faceChatRepository.saveFaceChatOrHistory(history2);
//
//        ChatRoom chatRoom = ChatRoom.builder()
//                .build();
//        chatRoomJpaRepository.save(chatRoom);
//
//        Friend friendM3W1 = new Friend(1, "칭기칭기", male3, female1, chatRoom);
//        friendJpaRepository.save(friendM3W1);
//
//        //when
//        /* 여자 1 새로 매칭 */
//
//        //then
//        /* 매칭에 실패해 새 방에 들어가 대기 */
//        assertThrows(NoResultException.class, () -> faceChatRepository.findAvailable(female1));
//    }
//
//    @Test
//    @Transactional
//    public void 방찾기테스트3() throws Exception {
//        //given
//        /* 남자 1 2 3 4가 순서대로 대기 중
//        여자 1은 1, 3과 매칭 이력이 있으며 2와 친구
//        남자 1과 매칭된 후 15분이 지남
//        */
//        Male male1 = saveMale("email1", "name1", "M1", "general");
//        Male male2 = saveMale("email2", "name2", "M2", "general");
//        Male male3 = saveMale("email3", "name3", "M3", "general");
//        Male male4 = saveMale("email4", "name4", "M4", "general");
//        faceChatService.getToken(male1.getId(), "male1Mask");
//        faceChatService.getToken(male2.getId(), "male2Mask");
//        faceChatService.getToken(male3.getId(), "male3Mask");
//        faceChatService.getToken(male4.getId(), "male4Mask");
//
//        Female female1 = saveFemale("email5", "name5", "F1", "general");
//
//        History history1 = new History(male1, female1, LocalDateTime.now().minusMinutes(15));
//        History history2 = new History(male3, female1, LocalDateTime.now());
//        faceChatRepository.saveFaceChatOrHistory(history1);
//        System.out.println("history1.getEnteredAt() = " + history1.getEnteredAt());
//        faceChatRepository.saveFaceChatOrHistory(history2);
//        System.out.println("history2.getEnteredAt() = " + history2.getEnteredAt());
//
//        ChatRoom chatRoom = ChatRoom.builder()
//                .build();
//        chatRoomJpaRepository.save(chatRoom);
//
//        Friend friendM2W1 = new Friend(1, "칭기칭기", male2, female1, chatRoom);
//        friendJpaRepository.save(friendM2W1);
//
//        //when
//        /* 여자 1 매칭 시작 */
//        FaceChat available = faceChatRepository.findAvailable(female1);
//
//        //then
//        /* 남자 1과 매칭 */
//        assertEquals(male1.getId(), available.getMale().getId());
//    }
//
//    public Male saveMale(String email, String name, String nickname, String type){
//        Male male = new Male(email, name, nickname, type);
//        userRepository.save(male);
//
//        return male;
//    }
//
//    public Female saveFemale(String email, String name, String nickname, String type){
//        Female female = new Female(email, name, nickname, type);
//        userRepository.save(female);
//
//        return female;
//    }
//}