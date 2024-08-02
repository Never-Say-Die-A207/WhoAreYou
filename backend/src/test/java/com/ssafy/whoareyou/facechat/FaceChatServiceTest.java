package com.ssafy.whoareyou.facechat;

import com.ssafy.whoareyou.facechat.controller.FaceChatController;
import com.ssafy.whoareyou.facechat.dto.FaceChatResultRequest;
import com.ssafy.whoareyou.facechat.service.FaceChatService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class FaceChatServiceTest {

    @Autowired
    FaceChatController faceChatController;

    @Autowired
    FaceChatService faceChatService;

    @Test
    void finish_BOTH_YES() {
        faceChatService.getToken(1, "mask1", false);
        faceChatService.getToken(2, "mask2", false);

        ResponseEntity<?> response1 = faceChatController.finish(
                new FaceChatResultRequest(1, 1, 2, true));
        ResponseEntity<?> response2 = faceChatController.finish(
                new FaceChatResultRequest(1, 2, 1, true));

        assertTrue(response1.getBody().equals(response2.getBody()));
    }
}