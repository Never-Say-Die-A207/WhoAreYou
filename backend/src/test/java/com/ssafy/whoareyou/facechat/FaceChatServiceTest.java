package com.ssafy.whoareyou.facechat;

import com.ssafy.whoareyou.user.entity.User;
import com.ssafy.whoareyou.facechat.service.FaceChatService;
import com.ssafy.whoareyou.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class FaceChatServiceTest {

    @Autowired
    FaceChatService faceChatService;

    @Autowired
    UserRepository userRepository;

    @Test
    public void 방찾기테스트() throws Exception{
        //given
        User user1 = userRepository.findOne(1);
        faceChatService.createNewFaceChat(user1, "");

        User user2 = userRepository.findOne(2);
        faceChatService.createNewFaceChat(user2, "");

        User user3 = userRepository.findOne(3);
        faceChatService.createNewFaceChat(user3, "");

        //when
        User user4 = userRepository.findOne(4);
        Integer findFaceChatId = faceChatService.getEmptyFaceChatId(user4);

        //then
        assertEquals(1, findFaceChatId);
    }

    public User createUser(String gender){
        User user = new User();
        user.setGender(gender);

        return user;
    }
}