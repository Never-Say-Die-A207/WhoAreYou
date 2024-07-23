package com.ssafy.whoareyou.facechat;

import com.ssafy.whoareyou.user.User;
import com.ssafy.whoareyou.user.UserRepository;
import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class FaceChatService {
    private final FaceChatRepository faceChatRepository;

    private final UserRepository userRepository;

    @Value("(${livekit.server.url)")
    private String LIVEKIT_SERVER_URL;
    @Value("${livekit.api.key}")
    private String LIVEKIT_API_KEY;
    @Value("${livekit.api.secret}")
    private String LIVEKIT_API_SECRET;

    //WebhookReceiver webhookReceiver = new WebhookReceiver("apiKey", "secret");
    //RoomServiceClient roomServiceClient = RoomServiceClient.create(LIVEKIT_SERVER_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);

    public AccessToken getFirstToken(Integer userId, String mask) {
        User user = userRepository.findOne(userId);
        FaceChat faceChat;

        if(user.getGender().equals("male"))
            faceChat = user.getFaceChatAsMale();
        else
            faceChat = user.getFaceChatAsFemale();

        if(faceChat == null){
            faceChat = getAvailableFaceChat(user, null);
            if(faceChat == null){
                faceChat = createFaceChat(user, mask);
            }
            else{
                faceChat.joinUser(user, mask);
                faceChatRepository.save(faceChat);
            }
        }

        return generateToken(user.getNickname(), String.valueOf(faceChat.getId()));
    }

    public AccessToken getOtherToken(Integer userId, String mask, Integer lastFaceChatId){
        User user = userRepository.findOne(userId);

        FaceChat faceChat = getAvailableFaceChat(user, lastFaceChatId);
        if(faceChat == null){
            faceChat = createFaceChat(user, mask);
        }
        else{
            faceChat.joinUser(user, mask);
            faceChatRepository.save(faceChat);
        }

        return generateToken(user.getNickname(), String.valueOf(faceChat.getId()));
    }

    public Integer removeUser(Integer userId){
        User user = userRepository.findOne(userId);

        FaceChat faceChat = faceChatRepository.findCurrentFaceChat(user);

        Boolean noOneLeft = faceChat.removeUser(user);
        if(noOneLeft){
            faceChatRepository.delete(faceChat);
            return null;
        }

        return faceChat.getId();
    }

    @Transactional(readOnly = true)
    public FaceChat getAvailableFaceChat(User user, Integer lastFaceChatId) {
        try{
            return faceChatRepository.findFirstFaceChatByGender(user.getGender(), lastFaceChatId);
        } catch(Exception e){
            return null;
        }
    }

    public FaceChat createFaceChat(User user, String mask) {
        FaceChat faceChat = FaceChat.createFaceChat(user, mask);
        faceChatRepository.save(faceChat);

        return faceChat;
    }


    private AccessToken generateToken(String username, String faceChatId){
        AccessToken accessToken = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
        accessToken.setName(username);
        accessToken.setIdentity(username);
        accessToken.addGrants(new RoomJoin(true), new RoomName(faceChatId));
        return accessToken;
    }
}
