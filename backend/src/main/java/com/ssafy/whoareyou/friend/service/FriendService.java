package com.ssafy.whoareyou.friend.service;

import com.ssafy.whoareyou.chat.repository.ChatMongoRepository;
import com.ssafy.whoareyou.friend.dto.SearchTargetDto;
import com.ssafy.whoareyou.chat.entity.ChatRoom;
import com.ssafy.whoareyou.chat.service.ChatRoomService;
import com.ssafy.whoareyou.friend.dto.FriendUserDto;
import com.ssafy.whoareyou.friend.entity.Friend;
import com.ssafy.whoareyou.friend.repository.FriendJpaRepository;
import com.ssafy.whoareyou.user.entity.Female;
import com.ssafy.whoareyou.user.entity.Male;
import com.ssafy.whoareyou.user.entity.User;
import com.ssafy.whoareyou.user.exception.InvalidGenderException;
import com.ssafy.whoareyou.user.exception.UserNotFoundException;
import com.ssafy.whoareyou.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FriendService {
    private final ChatMongoRepository chatMongoRepository;
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

    public int join(SearchTargetDto dto) {
        log.info("FaceChatRoom 가져오기");

        log.info("ChatRoom 생성");
        ChatRoom chatRoom = chatRoomService.create();

        log.info("남성 유저 정보 가져오기");
        User male = userRepository.findById(dto.getMaleId())
                .orElseThrow(() -> new NullPointerException("존재하지 않는 유저"));

        log.info("여성 유저 정보 가져오기");
        User female = userRepository.findById(dto.getFemaleId())
                .orElseThrow(() -> new NullPointerException("존재하지 않는 유저"));

        log.info("친구관계 생성");
        setRelation(chatRoom, (Male) male, (Female) female);

        return chatRoom.getId();
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public void setRelation(ChatRoom chatRoom, Male male, Female female) {
        boolean isPresent = friendJpaRepository.findByGenderId(male.getId(), female.getId()).isPresent();

        if(isPresent) {
            return;
        }

        Friend friend = Friend.builder()
                .male(male)
                .female(female)
                .chatRoom(chatRoom)
                .build();

        friendJpaRepository.save(friend);
    }

    public List<FriendUserDto> getFriends(User user, boolean isMale) {
        log.info("getFriends 시작");
        List<FriendUserDto> friends = isMale ? friendJpaRepository.findFemaleByMaleId(user.getId()) : friendJpaRepository.findMaleByFemaleId(user.getId());

        log.info("getFriends 종료");
        return friends;
    }

    public void delete(SearchTargetDto dto){
        Friend friend = friendJpaRepository.findByGenderId(dto.getMaleId(), dto.getFemaleId())
                .orElseThrow(() -> new NullPointerException("존재하지 않은 친구관계"));

        chatMongoRepository.deleteByChatRoomId(friend.getChatRoom().getId());
        friendJpaRepository.delete(friend);
    }

    public Integer find(Integer myId, Integer partnerId) {
        User me = userRepository.findById(myId).orElseThrow(() -> new UserNotFoundException(myId));
        User partner = userRepository.findById(partnerId).orElseThrow(() -> new UserNotFoundException(partnerId));

        Male m;
        Female f;

        //남녀가 해당 방에 제대로 있는 지 확인
        if(me instanceof Male){
            m = (Male)me;
            f = (Female)partner;
        }
        else if(me instanceof Female){
            m = (Male)partner;
            f = (Female)me;
        }
        else
            throw new InvalidGenderException();

        Friend friend = friendJpaRepository.findByGenderId(m.getId(), f.getId()).orElse(null);
        if(friend == null)
            return -1;
        return friend.getChatRoom().getId();
    }
}
