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
    private String myGender;
    private int partnerId;
    private String mask;
    private LocalDateTime startedAt;

    public static FaceChatInfoResponse createResponse(User user, FaceChat currentFaceChat) {
        FaceChatInfoResponse infoResponse = new FaceChatInfoResponse();

        infoResponse.setRoomId(currentFaceChat.getId());

        if (user instanceof Male){
            infoResponse.setMask(currentFaceChat.getFemaleMask());
            infoResponse.setMyGender("male");

            if(currentFaceChat.getFemale() != null)
                infoResponse.setPartnerId(currentFaceChat.getFemale().getId());
        }
        else if (user instanceof Female){
            infoResponse.setMask(currentFaceChat.getMaleMask());
            infoResponse.setMyGender("female");

            if(currentFaceChat.getFemale() != null)
                infoResponse.setPartnerId(currentFaceChat.getMale().getId());
        }

        infoResponse.setStartedAt(currentFaceChat.getStartedAt());

        return infoResponse;
    }
}
