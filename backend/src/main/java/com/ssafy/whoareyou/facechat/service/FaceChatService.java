package com.ssafy.whoareyou.facechat.service;

import com.ssafy.whoareyou.facechat.entity.FaceChat;
import com.ssafy.whoareyou.facechat.exception.FaceChatNotFoundException;
import com.ssafy.whoareyou.user.entity.Female;
import com.ssafy.whoareyou.user.entity.Male;
import com.ssafy.whoareyou.user.entity.User;
import com.ssafy.whoareyou.facechat.entity.History;
import com.ssafy.whoareyou.facechat.dto.FaceChatInfoResponse;
import com.ssafy.whoareyou.facechat.repository.FaceChatRepository;
import com.ssafy.whoareyou.user.exception.InvalidGenderException;
import com.ssafy.whoareyou.user.exception.UserNotFoundException;
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

    public AccessToken getToken(Integer userId, String mask, boolean needsChange) {
        log.info("Searching...");
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));
        String gender = getGender(user).orElseThrow(InvalidGenderException::new);

        FaceChat faceChat;
        if(user instanceof Male m)
            faceChat = m.getFaceChatAsMale();
        else{
            faceChat = ((Female)user).getFaceChatAsFemale();
        }

        if(faceChat == null || needsChange){
            if(needsChange)
                quitUser(userId);

            faceChat = getAvailableFaceChat(user, gender);
            if(faceChat == null){
                log.info("Create face chat.");
                faceChat = createFaceChat(user, mask);
            }
            else{
                log.info("Success to find face chat");
                faceChat.joinUser(user, mask);
                createHistoryForBoth(faceChat);
            }
            faceChatRepository.saveFaceChatOrHistory(faceChat);
        }
        else{
            log.info("Already in face chat.");
        }

        return generateToken(user.getNickname(), user.getId(), String.valueOf(faceChat.getId()));
    }

    public void quitUser(Integer userId) {
        log.info("quit.");
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));
        String gender = getGender(user).orElseThrow(InvalidGenderException::new);

        FaceChat faceChat = faceChatRepository.findMy(user, gender).orElseThrow(FaceChatNotFoundException::new);

        Boolean noOneLeft = faceChat.removeUser(user);

        if(noOneLeft)
            faceChatRepository.deleteFaceChat(faceChat);
    }

    @Transactional(readOnly = true)
    public FaceChatInfoResponse getInfo(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));
        String gender = getGender(user).orElseThrow(InvalidGenderException::new);

        FaceChat currentFaceChat = faceChatRepository.findMy(user, gender).orElseThrow(FaceChatNotFoundException::new);

        return FaceChatInfoResponse.createResponse(user, currentFaceChat);
    }

    @Transactional(readOnly = true)
    public FaceChat getAvailableFaceChat(User user, String gender) {
        return faceChatRepository.findAvailable(user, gender).orElse(null);
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

    private AccessToken generateToken(String nickname, int id, String faceChatId){
        AccessToken accessToken = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
        accessToken.setName(nickname);
        accessToken.setIdentity(String.valueOf(id));
        accessToken.addGrants(new RoomJoin(true), new RoomName(faceChatId));
        return accessToken;
    }

    private Optional<String> getGender(User user) {
        if(user instanceof Male)
            return Optional.of("male");
        else if(user instanceof Female)
            return Optional.of("female");
        return Optional.empty();
    }
}
