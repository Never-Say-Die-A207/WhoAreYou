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
}