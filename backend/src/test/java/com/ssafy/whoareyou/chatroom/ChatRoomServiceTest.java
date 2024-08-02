package com.ssafy.whoareyou.chatroom;

import com.ssafy.whoareyou.friend.entity.SearchTargetDto;
import com.ssafy.whoareyou.chat.dto.SendingMessage;
import com.ssafy.whoareyou.chat.entity.mongo.Chat;
import com.ssafy.whoareyou.chat.entity.ChatRoom;
import com.ssafy.whoareyou.chat.repository.ChatMongoRepository;
import com.ssafy.whoareyou.chat.repository.ChatRoomJpaRepository;
import com.ssafy.whoareyou.chat.service.ChatRoomService;
import com.ssafy.whoareyou.facechat.repository.FaceChatRepository;
import com.ssafy.whoareyou.friend.entity.Friend;
import com.ssafy.whoareyou.friend.repository.FriendJpaRepository;
import com.ssafy.whoareyou.user.entity.Female;
import com.ssafy.whoareyou.user.entity.Male;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class ChatRoomServiceTest {
    //LoadHistoryTest 작성중 friendJpaRepository.getGenderId 구현중
    @InjectMocks
    ChatRoomService chatRoomService;

    @Mock
    FriendJpaRepository friendJpaRepository;

    @Mock
    ChatRoomJpaRepository chatRoomJpaRepository;

    @Mock
    ChatMongoRepository chatMongoRepository;

    @Mock
    FaceChatRepository faceChatRepository;

    static Male male1;
    static Female female1;

    @BeforeAll
    static void beforeAll() {
        male1 = new Male("email@male.com", "남자1", "남자닉네임1", "general");
        female1 = new Female("email@female.com", "여자1", "여자닉네임1", "general");
    }

    @Test
    void getExistRoom() {
        // chatroom 생성
        ChatRoom chatRoom = ChatRoom.builder()
                .id(2)
                .friends(new ArrayList<>())
                .build();

        // 친구관계 생성
        Friend friend = Friend.builder()
                .male(male1)
                .female(female1)
                .chatRoom(chatRoom)
                .build();

        Mockito.when(friendJpaRepository.findByGenderId(male1.getId(), female1.getId())).thenReturn(Optional.of(friend));

        Friend result = friendJpaRepository.findByGenderId(male1.getId(), female1.getId()).orElseThrow(() -> new NullPointerException("없다리"));

        // genderId로 friend를 찾을 시 friend 반환
        Assertions.assertEquals(result.getChatRoom().getId(), chatRoom.getId());
    }

    @Test
    void loadHistoryTest() {
        // 방 저장
        ChatRoom chatRoom = ChatRoom.builder()
                .id(1)
                .friends(null)
                .build();

        // 친구 저장
        Friend friend = Friend.builder()
                .male(male1)
                .female(female1)
                .chatRoom(chatRoom)
                .build();

        // 채팅 저장
        Chat chat1 = Chat.builder()
                .nickname("남자메세지")
                .message("첫 메세지")
                .chatRoomId(chatRoom.getId())
                .time("처음")
                .build();
        Chat chat2 = Chat.builder()
                .nickname("남자메세지")
                .message("중간 메세지")
                .chatRoomId(chatRoom.getId())
                .time("중간")
                .build();
        Chat chat3 = Chat.builder()
                .nickname("남자메세지")
                .message("끝 메세지")
                .chatRoomId(chatRoom.getId())
                .time("끝")
                .build();

        List<Chat> chatList = new ArrayList<>();
        chatList.add(chat1);
        chatList.add(chat2);
        chatList.add(chat3);

        // 남성과 여성을 기준으로 ChatRoom 찾기
        Mockito.when(friendJpaRepository.findByGenderId(male1.getId(), female1.getId())).thenReturn(Optional.of(friend));

        // 채팅 가져오기
        Mockito.when(chatMongoRepository.findByRoomId(chatRoom.getId())).thenReturn(chatList);

        //Sending Message로 만들기
        SendingMessage message1 = SendingMessage.builder()
                .sender(chat1.getNickname())
                .message(chat1.getMessage())
                .time(chat1.getTime())
                .build();

        SendingMessage message2 = SendingMessage.builder()
                .sender(chat2.getNickname())
                .message(chat2.getMessage())
                .time(chat2.getTime())
                .build();

        SendingMessage message3 = SendingMessage.builder()
                .sender(chat3.getNickname())
                .message(chat3.getMessage())
                .time(chat3.getTime())
                .build();

        List<SendingMessage> messages = new ArrayList<>();
        messages.add(message1);
        messages.add(message2);
        messages.add(message3);

        //실제 테스트 결과 가져오기
        List<SendingMessage> result = chatRoomService.loadHistorys(new SearchTargetDto(male1.getId(), female1.getId()));

        //비교하기
        Assertions.assertEquals(result.get(0).getMessage(), message1.getMessage());
        Assertions.assertEquals(result.get(1).getMessage(), message2.getMessage());
        Assertions.assertEquals(result.get(2).getMessage(), message3.getMessage());
    }
}
