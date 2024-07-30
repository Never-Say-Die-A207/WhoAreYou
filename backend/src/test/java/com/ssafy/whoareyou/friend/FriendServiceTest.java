package com.ssafy.whoareyou.friend;

import com.ssafy.whoareyou.chat.dto.SearchTargetChatRoom;
import com.ssafy.whoareyou.chat.entity.ChatRoom;
import com.ssafy.whoareyou.chat.repository.ChatJpaRepository;
import com.ssafy.whoareyou.chat.repository.ChatRoomJpaRepository;
import com.ssafy.whoareyou.chat.service.ChatRoomService;
import com.ssafy.whoareyou.facechat.entity.FaceChat;
import com.ssafy.whoareyou.facechat.repository.FaceChatRepository;
import com.ssafy.whoareyou.friend.dto.FriendUserDto;
import com.ssafy.whoareyou.friend.entity.Friend;
import com.ssafy.whoareyou.friend.repository.FriendJpaRepository;
import com.ssafy.whoareyou.friend.service.FriendService;
import com.ssafy.whoareyou.user.entity.Female;
import com.ssafy.whoareyou.user.entity.Male;
import com.ssafy.whoareyou.user.entity.User;
import com.ssafy.whoareyou.user.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class FriendServiceTest {

    @InjectMocks
    FriendService friendSrvice;

    @Mock
    ChatRoomService chatRoomService;

    @Mock
    FriendJpaRepository friendJpaRepository;

    @Mock
    UserRepository userRepository;

    @Mock
    ChatRoomJpaRepository chatRoomJpaRepository;

    @Mock
    ChatJpaRepository chatJpaRepository;

    @Mock
    FaceChatRepository faceChatRepository;

    static Male male1;
    static Female female1;

    @BeforeAll
    static void beforeAll(){
        male1 = new Male("email@male1.com", "남자1", "남자닉네임1", "general");
        female1 = new Female("email@female1.com", "여자1", "여자닉네임1", "general");
    }

    @Test
    void getListTest() {
        // 성별이 여자인 회원 생성
        Female female2 = new Female("email@female2.com", "여자2", "여자닉네임2", "general");
        Female female3 = new Female("email@female3.com", "여자3", "여자닉네임3", "general");
        Female female4 = new Female("email@female4.com", "여자4", "여자닉네임4", "general");

        // 기준이 되는 회원은 성별이 남성인 회원
        // repository에서 가져온다
        Mockito.when(userRepository.findById(male1.getId())).thenReturn(Optional.of(male1));

        // 친구 목록으로 추가 된 친구목록 리스트 형성
        List<Friend> friends = new ArrayList<>();
        friends.add(new Friend(1, null, male1, female1, null, "femalemask1", new ChatRoom()));
        friends.add(new Friend(2, null, male1, female2, null, "femalemask2", new ChatRoom()));
        friends.add(new Friend(3, null, male1, female3, null, "femalemask3", new ChatRoom()));
        friends.add(new Friend(4, null, male1, female4, null, "femalemask4", new ChatRoom()));

        // 성별이 남성인 사람의 친구는 여자
        Mockito.when(friendJpaRepository.findFemaleByMaleId(male1.getId())).thenReturn(friends);

        // FriendUserDto로 결과 생성
        List<FriendUserDto> friendUsers = new ArrayList<>();
        for (Friend curUser : friends) {
            friendUsers.add(FriendUserDto.builder()
                    .nickname(curUser.getFemale().getNickname())
                            .maskName(curUser.getFemaleMask())
                    .build());
        }

        List<FriendUserDto> result = friendSrvice.getList(male1.getId());

        // 비교
        Assertions.assertEquals(friendUsers.get(0).getNickname(), result.get(0).getNickname());
        Assertions.assertEquals(friendUsers.get(1).getNickname(), result.get(1).getNickname());
        Assertions.assertEquals(friendUsers.get(2).getNickname(), result.get(2).getNickname());
        Assertions.assertEquals(friendUsers.get(3).getNickname(), result.get(3).getNickname());
    }

    //@Test
    void joinTest(){
        ChatRoom chatRoom = new ChatRoom(1, null, null);

        Mockito.when(chatRoomService.create()).thenReturn(chatRoom);

        // FaceChat 가져오기
        FaceChat faceChat = new FaceChat();
        faceChat.joinUser(male1, "MaleMask_SpriderMan");
        faceChat.joinUser(female1, "FemaleMask_Venom");

        // FaceChatRepository에서 findById하면 faceChat을 반환
        Mockito.when(faceChatRepository.findById(1)).thenReturn(Optional.of(faceChat));

        // 친구관계 저장
        Friend friend = Friend.builder()
                .male(male1)
                .female(female1)
                .maleMask(faceChat.getMaleMask())
                .femaleMask(faceChat.getFemaleMask())
                .chatRoom(chatRoom)
                .build();

        Mockito.when(friendJpaRepository.save(friend)).thenReturn(friend);

        int result = friendSrvice.join(1, new SearchTargetChatRoom(male1.getId(), female1.getId()));
        Assertions.assertEquals(result, chatRoom.getId());
    }
}
