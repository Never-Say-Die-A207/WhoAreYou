package com.ssafy.whoareyou.facechat.service;

import com.ssafy.whoareyou.facechat.entity.FaceChat;
import com.ssafy.whoareyou.user.entity.User;
import com.ssafy.whoareyou.facechat.entity.History;
import com.ssafy.whoareyou.facechat.dto.FaceChatInfoResponse;
import com.ssafy.whoareyou.facechat.repository.FaceChatRepository;
import com.ssafy.whoareyou.user.repository.UserRepository;
import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class FaceChatService {
    private final FaceChatRepository faceChatRepository;

    private final UserRepository userRepository;

//    @Value("(${livekit.server.url)")
//    private String LIVEKIT_SERVER_URL;
    @Value("${livekit.api.key}")
    private String LIVEKIT_API_KEY;
    @Value("${livekit.api.secret}")
    private String LIVEKIT_API_SECRET;

    public AccessToken getToken(Integer userId, String mask) {
        Optional<User> user = userRepository.findById(userId);
        FaceChat faceChat;

        if(user.get().getGender().equals("male"))
            faceChat = user.get().getFaceChatAsMale();
        else
            faceChat = user.get().getFaceChatAsFemale();

        if(faceChat == null){
            faceChat = getAvailableFaceChat(user.get(), null);
            if(faceChat == null){
                faceChat = createFaceChat(user.get(), mask);
            }
            else{
                faceChat.joinUser(user.get(), mask);
                createHistoryForBoth(faceChat);
                faceChatRepository.saveFaceChatOrHistory(faceChat);
            }
        }

        return generateToken(user.get().getNickname(), String.valueOf(faceChat.getId()));
    }

    public AccessToken getFirstToken(Integer userId, String mask) {
        Optional<User> user = userRepository.findById(userId);
        FaceChat faceChat;

        if(user.get().getGender().equals("male"))
            faceChat = user.get().getFaceChatAsMale();
        else
            faceChat = user.get().getFaceChatAsFemale();

        if(faceChat == null){
            faceChat = getAvailableFaceChat(user.get(), null);
            if(faceChat == null){
                faceChat = createFaceChat(user.get(), mask);
            }
            else{
                faceChat.joinUser(user.get(), mask);
                createHistoryForBoth(faceChat);
                faceChatRepository.saveFaceChatOrHistory(faceChat);
            }
        }

        return generateToken(user.get().getNickname(), String.valueOf(faceChat.getId()));
    }

    public AccessToken getOtherToken(Integer userId, String mask, Integer lastFaceChatId){
        Optional<User> userOpt = userRepository.findById(userId);
        User user = userOpt.get();

        FaceChat faceChat = getAvailableFaceChat(user, lastFaceChatId);
        if(faceChat == null){
            faceChat = createFaceChat(user, mask);
        }
        else{
            faceChat.joinUser(user, mask);
            faceChat.updateMatchingCount();
            faceChatRepository.saveFaceChatOrHistory(faceChat);
        }

        return generateToken(user.getNickname(), String.valueOf(faceChat.getId()));
    }

    public Integer removeUser(Integer userId){
        Optional<User> userOpt = userRepository.findById(userId);
        User user = userOpt.get();

        FaceChat faceChat = faceChatRepository.findCurrentFaceChat(user);

        Boolean noOneLeft = faceChat.removeUser(user);

        if(noOneLeft){
            faceChatRepository.delete(faceChat);
            return null;
        }

        return faceChat.getId();
    }

    public FaceChatInfoResponse getInfo(Integer userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        User user = userOpt.get();

        FaceChat currentFaceChat = faceChatRepository.findCurrentFaceChat(user);

        FaceChatInfoResponse infoResponse = new FaceChatInfoResponse();
        infoResponse.setId(currentFaceChat.getId());
        if (user.getGender().equals("male"))
            infoResponse.setMask(currentFaceChat.getFemaleMask());
        else
            infoResponse.setMask(currentFaceChat.getMaleMask());
        infoResponse.setStartedAt(currentFaceChat.getStartedAt());

        return infoResponse;
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
        faceChatRepository.saveFaceChatOrHistory(faceChat);

        return faceChat;
    }

    public void createHistoryForBoth(FaceChat faceChat){
        User male = faceChat.getMale();
        User female = faceChat.getFemale();

        History historyForMale = new History(male, faceChat);
        male.getRecentFaceChats().add(historyForMale);
        userRepository.save(male);
        faceChatRepository.saveFaceChatOrHistory(historyForMale);

        History historyForFemale = new History(female, faceChat);
        female.getRecentFaceChats().add(historyForFemale);
        userRepository.save(female);
        faceChatRepository.saveFaceChatOrHistory(historyForFemale);
    }

    private AccessToken generateToken(String username, String faceChatId){
        AccessToken accessToken = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
        accessToken.setName(username);
        accessToken.setIdentity(username);
        accessToken.addGrants(new RoomJoin(true), new RoomName(faceChatId));
        return accessToken;
    }
}
