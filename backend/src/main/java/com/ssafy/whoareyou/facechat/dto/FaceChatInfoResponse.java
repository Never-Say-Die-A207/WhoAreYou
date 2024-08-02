package com.ssafy.whoareyou.facechat.dto;

import com.ssafy.whoareyou.facechat.entity.FaceChat;
import com.ssafy.whoareyou.user.entity.Female;
import com.ssafy.whoareyou.user.entity.Male;
import com.ssafy.whoareyou.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
public class FaceChatInfoResponse {
    private int roomId;
    private int partnerId;
    private String mask;
    private LocalDateTime startedAt;

    public static FaceChatInfoResponse createResponse(User user, FaceChat currentFaceChat) {
        FaceChatInfoResponse infoResponse = new FaceChatInfoResponse();

        infoResponse.setRoomId(currentFaceChat.getId());
        if (user instanceof Male)
            infoResponse.setMask(currentFaceChat.getFemaleMask());
        else if (user instanceof Female)
            infoResponse.setMask(currentFaceChat.getMaleMask());
        infoResponse.setStartedAt(currentFaceChat.getStartedAt());

        return infoResponse;
    }
}
