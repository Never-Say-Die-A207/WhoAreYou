package com.ssafy.whoareyou.friend;

import com.ssafy.whoareyou.user.User;
import com.ssafy.whoareyou.user.UserRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class FriendServiceTest {

    @Autowired
    EntityManager em;
    @Autowired
    FriendService friendService;
    @Autowired
    UserRepository userRepository;

    @Test
    public void addFriendTest() throws Exception{
        //given
        User user1 = new User();
        user1.setName("황태건");
        User user2 = new User();
        user2.setName("태태건");
        em.persist(user1);
        em.persist(user2);

        //when
        int id1 = user1.getId();
        int id2 = user2.getId();
        Long friendId = friendService.addFriend(id1, id2);

        //then
        User finduser = userRepository.findOne(id1);
        assertEquals(1, finduser.getFriends().size(), "유저1의 친구 리스트에 하나가 추가되어야 합니다.");
    }

    @Test
    public void findFriendListTest() throws Exception{
        //given
        User user1 = new User();
        user1.setName("황태건");
        User user2 = new User();
        user2.setName("태태건");
        em.persist(user1);
        em.persist(user2);

        //when
        int id1 = user1.getId();
        int id2 = user2.getId();
        Long friendId = friendService.addFriend(id1, id2);

        //then
        List<Friend> user1Friends = friendService.findFriends(id1);
        assertEquals(1, user1Friends.size(), "유저1의 친구 리스트에 하나가 추가되어야 합니다.");
    }

    @Test
    public void deleteFriendTest(){
        //given
        User user1 = new User();
        user1.setName("황태건");
        User user2 = new User();
        user2.setName("태태건");
        User user3 = new User();
        user3.setName("건태건");
        em.persist(user1);
        em.persist(user2);
        em.persist(user3);

        //when
        int id1 = user1.getId();
        int id2 = user2.getId();
        int id3 = user3.getId();
        friendService.addFriend(id1, id2);
        friendService.addFriend(id1, id3);

        User findUser = userRepository.findOne(id1);
        Long friendId = findUser.getFriends().get(1).getId();
        friendService.deleteFriend(friendId);

        //then
        assertEquals(1, findUser.getFriends().size(), "친구가 둘 추가되고 하나 삭제되어야 합니다.");
    }
}