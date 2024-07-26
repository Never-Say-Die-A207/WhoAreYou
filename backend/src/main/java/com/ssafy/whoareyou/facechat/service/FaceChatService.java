package com.ssafy.whoareyou.facechat.service;

import com.ssafy.whoareyou.facechat.entity.FaceChat;
import com.ssafy.whoareyou.user.entity.Female;
import com.ssafy.whoareyou.user.entity.Male;
import com.ssafy.whoareyou.user.entity.User;
import com.ssafy.whoareyou.facechat.entity.History;
import com.ssafy.whoareyou.facechat.dto.FaceChatInfoResponse;
import com.ssafy.whoareyou.facechat.repository.FaceChatRepository;
import com.ssafy.whoareyou.user.repository.UserRepository;
import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class FaceChatService {
    private static final Logger log = LoggerFactory.getLogger(FaceChatService.class);
    private final FaceChatRepository faceChatRepository;

    private final UserRepository userRepository;

//    @Value("(${livekit.server.url)")
//    private String LIVEKIT_SERVER_URL;
    @Value("${livekit.api.key}")
    private String LIVEKIT_API_KEY;
    @Value("${livekit.api.secret}")
    private String LIVEKIT_API_SECRET;

    public AccessToken getToken(Integer userId, String mask, boolean needsChange) throws Exception {
        Optional<User> userOpt = userRepository.findById(userId);
        User user = userOpt.orElse(null);
        if(user == null)
            throw new Exception("user not found");

        FaceChat faceChat;
        if(user instanceof Male m)
            faceChat = m.getFaceChatAsMale();
        else if(user instanceof Female f)
            faceChat = f.getFaceChatAsFemale();
        else
            throw new Exception("user is not a male or Female");


        if(faceChat == null || needsChange){
            if(needsChange)
                removeUser(userId);

            faceChat = getAvailableFaceChat(user);
            if(faceChat == null){
                faceChat = createFaceChat(user, mask);
            }
            else{
                System.out.println("faceChat.getMale().getId() = " + faceChat.getMale().getId());
                faceChat.joinUser(user, mask);
                createHistoryForBoth(faceChat);
                faceChatRepository.saveFaceChatOrHistory(faceChat);
            }
        }

        return generateToken(user.getNickname(), String.valueOf(faceChat.getId()));
    }

    public void removeUser(Integer userId){
        Optional<User> userOpt = userRepository.findById(userId);
        User user = userOpt.orElse(null);
        if(user == null)
            return;

        FaceChat faceChat = faceChatRepository.findMy(user);

        Boolean noOneLeft = faceChat.removeUser(user);

        if(noOneLeft)
            faceChatRepository.deleteFaceChat(faceChat);
    }

    @Transactional(readOnly = true)
    public FaceChatInfoResponse getInfo(Integer userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        User user = userOpt.orElse(null);
        if(user == null)
            return null;

        FaceChat currentFaceChat = faceChatRepository.findMy(user);

        return FaceChatInfoResponse.createResponse(user, currentFaceChat);
    }

    @Transactional(readOnly = true)
    public FaceChat getAvailableFaceChat(User user) {
        try{
            return faceChatRepository.findAvailable(user);
        } catch(IllegalArgumentException e){
            log.error(e.getMessage() + user.getClass());
            return null;
        } catch (Exception e){
            log.error("Error getting face chat : no such result or else");
            return null;
        }
    }

    public FaceChat createFaceChat(User user, String mask) {
        FaceChat faceChat = new FaceChat();
        faceChat.joinUser(user, mask);
        faceChatRepository.saveFaceChatOrHistory(faceChat);

        return faceChat;
    }

    public void createHistoryForBoth(FaceChat faceChat){
        LocalDateTime now = LocalDateTime.now();
        Male male = faceChat.getMale();
        Female female = faceChat.getFemale();

        History historyForMale = new History(male, female, now);
        male.getHistoriesAsMale().add(historyForMale);
        userRepository.save(male);
        faceChatRepository.saveFaceChatOrHistory(historyForMale);

        History historyForFemale = new History(male, female, now);
        female.getHistoriesAsFemale().add(historyForFemale);
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

//    public AccessToken getFirstToken(Integer userId, String mask) {
//        Optional<User> user = userRepository.findById(userId);
//        FaceChat faceChat;
//
//        if(user.get().getGender().equals("male"))
//            faceChat = user.get().getFaceChatAsMale();
//        else
//            faceChat = user.get().getFaceChatAsFemale();
//
//        if(faceChat == null){
//            faceChat = getAvailableFaceChat(user.get(), null);
//            if(faceChat == null){
//                faceChat = createFaceChat(user.get(), mask);
//            }
//            else{
//                faceChat.joinUser(user.get(), mask);
//                createHistoryForBoth(faceChat);
//                faceChatRepository.saveFaceChatOrHistory(faceChat);
//            }
//        }
//
//        return generateToken(user.get().getNickname(), String.valueOf(faceChat.getId()));
//    }

//    public AccessToken getOtherToken(Integer userId, String mask, Integer lastFaceChatId){
//        Optional<User> userOpt = userRepository.findById(userId);
//        User user = userOpt.get();
//
//        FaceChat faceChat = getAvailableFaceChat(user, lastFaceChatId);
//        if(faceChat == null){
//            faceChat = createFaceChat(user, mask);
//        }
//        else{
//            faceChat.joinUser(user, mask);
//            faceChat.updateMatchingCount();
//            faceChatRepository.saveFaceChatOrHistory(faceChat);
//        }
//
//        return generateToken(user.getNickname(), String.valueOf(faceChat.getId()));
//    }
}
