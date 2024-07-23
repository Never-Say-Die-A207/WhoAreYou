package com.ssafy.whoareyou.facechat;

import com.ssafy.whoareyou.user.User;
import com.ssafy.whoareyou.user.UserRepository;
import io.livekit.server.*;
import livekit.LivekitModels;
import livekit.LivekitWebhook;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import retrofit2.Call;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FaceChatService {
    private final FaceChatRepository faceChatRepository;

    private final UserRepository userRepository;

    @Value("(${livekit.server.url)")
    private String LIVEKIT_SERVER_URL;

    @Value("${livekit.api.key}")
    private String LIVEKIT_API_KEY;

    @Value("${livekit.api.secret}")
    private String LIVEKIT_API_SECRET;

    public AccessToken createToken(Integer userId) {
        AccessToken accessToken = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);

        User user = userRepository.findOne(userId);

        String name = user.getName();

        accessToken.setName(name);
        accessToken.setIdentity(name);

        String roomName = getEmptyRoom(user);

        //RoomServiceClient roomServiceClient = RoomServiceClient.create(LIVEKIT_SERVER_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
        accessToken.addGrants(new RoomJoin(true), new RoomName(roomName));

        return accessToken;
    }

    //방만들기
    //성별을 기반으로 유저를 찾는다
    public String getEmptyRoom(User user) {
        String gender = user.getGender();

        FaceChat room = faceChatRepository.findRoomByGender(gender);
        if(room == null){
            room = FaceChat.createRoom(user);
            faceChatRepository.save(room);
        }
        else{
            faceChatRepository.deleteRoom(room);
        }

        return String.valueOf(room.getId());
    }

//방 관리
//    public void manageRoom(){
//        WebhookReceiver webhookReceiver = new WebhookReceiver("apiKey", "secret");;
//        LivekitWebhook.WebhookEvent webhookEvent = webhookReceiver.receive("postBody", "authHeader");
//        webhookEvent.ro
//    }
}
