package com.ssafy.whoareyou.friend.service;

import com.ssafy.whoareyou.chat.dto.SearchTargetChatRoom;
import com.ssafy.whoareyou.chat.entity.ChatRoom;
import com.ssafy.whoareyou.chat.service.ChatRoomService;
import com.ssafy.whoareyou.facechat.entity.FaceChat;
import com.ssafy.whoareyou.facechat.repository.FaceChatRepository;
import com.ssafy.whoareyou.friend.dto.FriendUserDto;
import com.ssafy.whoareyou.friend.entity.Friend;
import com.ssafy.whoareyou.friend.repository.FriendJpaRepository;
import com.ssafy.whoareyou.user.entity.Female;
import com.ssafy.whoareyou.user.entity.Male;
import com.ssafy.whoareyou.user.entity.User;
import com.ssafy.whoareyou.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class FriendService {
    private final FaceChatRepository faceChatRepository;
    private final ChatRoomService chatRoomService;
    private final UserRepository userRepository;
    private final FriendJpaRepository friendJpaRepository;

    public List<FriendUserDto> getList(int userId) {
        log.info("찬구 리스트 불러오기 실행");

        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("존재하지 않은 유저"));
        log.info("사용자 정보 불러오기");


        log.info("남성 / 여성에 따라 친구 리스트 불러오기");
        List<FriendUserDto> friendUsers = getFriends(user, user instanceof Male);

        log.info("친구 리스트 불러오기 종료");
        return friendUsers;
    }

    public int join(int faceChatRoomId, SearchTargetChatRoom dto) {
        log.info("FaceChatRoom 가져오기");
        FaceChat faceChat = faceChatRepository.findById(faceChatRoomId)
                .orElseThrow(() -> new NullPointerException("존재하지 않는 FaceChatRoom"));

        log.info("ChatRoom 생성");
        ChatRoom chatRoom = chatRoomService.create();

        log.info("남성 유저 정보 가져오기");
        User male = userRepository.findById(dto.getMaleId())
                .orElseThrow(() -> new NullPointerException("존재하지 않는 유저"));

        log.info("여성 유저 정보 가져오기");
        User female = userRepository.findById(dto.getFemaleId())
                .orElseThrow(() -> new NullPointerException("존재하지 않는 유저"));

        log.info("친구관계 생성");
        setRelation(faceChat, chatRoom, (Male) male, (Female) female);

        return chatRoom.getId();
    }

    public void setRelation(FaceChat faceChat, ChatRoom chatRoom, Male male, Female female) {
        Friend friend = Friend.builder()
                .male(male)
                .female(female)
                .chatRoom(chatRoom)
                .build();

        friendJpaRepository.save(friend);
    }

    public List<FriendUserDto> getFriends(User user, boolean isMale) {
        List<Friend> friends = isMale ? friendJpaRepository.findFemaleByMaleId(user.getId()) : friendJpaRepository.findMaleByFemaleId(user.getId());

        List<FriendUserDto> friendUserDtos = new ArrayList<>();
        for (Friend friend : friends) {
            FriendUserDto dto;
            if (isMale) {
                dto = FriendUserDto.builder()
                        .nickname(friend.getFemale().getNickname())
                        .build();
            }
            else {
                dto = FriendUserDto.builder()
                        .nickname(friend.getMale().getNickname())
                        .build();
            }

            friendUserDtos.add(dto);
        }

        return friendUserDtos;
    }

}
