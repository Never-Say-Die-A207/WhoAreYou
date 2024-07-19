package com.ssafy.whoareyou.friend;

import com.ssafy.whoareyou.user.User;
import com.ssafy.whoareyou.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class FriendService {
    private final UserRepository userRepository;
    private final FriendRepository friendRepository;

    @Transactional
    public Long addFriend(int fromId, int toId){
        User from = userRepository.findOne(fromId);
        User to = userRepository.findOne(toId);

        Friend friend = Friend.createFriend(from, to);
        from.getFriends().add(friend);

        userRepository.save(from);

        return friend.getId();
    }

    @Transactional
    public void deleteFriend(long friendId){
        Friend findFriend = friendRepository.findOne(friendId);

        User from = findFriend.getFrom();
        from.getFriends().remove(findFriend);

        userRepository.save(from);

        friendRepository.delete(findFriend);
    }

    public List<FriendResponseDto> findFriends(int userId){
        List<Friend> friends = friendRepository.findAllById(userId);

        List<FriendResponseDto> friendResponseDtoList = new ArrayList<>();
        for(Friend friend : friends){
            FriendResponseDto dto = new FriendResponseDto();
            dto.setFriendResponseDto(friend);
            friendResponseDtoList.add(dto);
        }

        return friendResponseDtoList;
    }
}
