package com.ssafy.whoareyou.facechat.service;

import com.ssafy.whoareyou.chat.service.ChatRoomService;
import com.ssafy.whoareyou.facechat.dto.FaceChatInfoResponse;
import com.ssafy.whoareyou.facechat.entity.FaceChat;
import com.ssafy.whoareyou.facechat.entity.History;
import com.ssafy.whoareyou.facechat.entity.WantsFriendType;
import com.ssafy.whoareyou.facechat.exception.FaceChatNotFoundException;
import com.ssafy.whoareyou.facechat.repository.FaceChatRepository;
import com.ssafy.whoareyou.friend.entity.SearchTargetDto;
import com.ssafy.whoareyou.friend.service.FriendService;
import com.ssafy.whoareyou.user.entity.Female;
import com.ssafy.whoareyou.user.entity.Male;
import com.ssafy.whoareyou.user.entity.User;
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
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
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
    private final ChatRoomService chatRoomService;
    private final FriendService friendService;


//    @Value("(${livekit.server.url)")
//    private String LIVEKIT_SERVER_URL;
    @Value("${livekit.api.key}")
    private String LIVEKIT_API_KEY;
    @Value("${livekit.api.secret}")
    private String LIVEKIT_API_SECRET;

    public AccessToken getToken(Integer userId, String mask, boolean needsChange) {
        log.info("FaceChatService.getToken() : Get Token");
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
                log.info("FaceChatService.getToken() : Failed to find available face chat for user " + userId);
                log.info("FaceChatService.getToken() : Create new face chat");
                faceChat = createFaceChat(user, mask);
            }
            else{
                log.info("FaceChatService.getToken() : Success to find available face chat for user " + userId);
                faceChat.joinUser(user, mask);
                createHistoryForBoth(faceChat);
            }
            faceChatRepository.saveFaceChatOrHistory(faceChat);
        }
        else{
            log.info("FaceChatService.getToken() : User " + userId + " is Already in face chat.");
        }

        return generateToken(user.getNickname(), user.getId(), String.valueOf(faceChat.getId()));
    }

    public void quitUser(Integer userId) {
        log.info("FaceChatService.quitUser() : Start to quit User " + userId);
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));
        String gender = getGender(user).orElseThrow(InvalidGenderException::new);

        FaceChat faceChat = faceChatRepository.findMy(user, gender).orElse(null);
        if(faceChat == null){
            log.info("FaceChatService.quitUser() : This user is not in any face chat. Nothing happens");
            return;
        }

        log.info("FaceChatService.quitUser() : Remove user " + userId + " from face chat " + faceChat.getId());
        Boolean noOneLeft = faceChat.removeUser(user);

        if(noOneLeft){
            log.info("FaceChatService.quitUser() : Now face chat " + faceChat.getId() + " is empty.");
            faceChatRepository.deleteFaceChat(faceChat);
        }
    }

    @Transactional(readOnly = true)
    public FaceChatInfoResponse getInfo(Integer userId) {
        log.info("FaceChatService : Get FaceChat Info of User " + userId);

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

        History history = new History(male, female, now);
        male.getHistoriesAsMale().add(history);
        userRepository.save(male);

        female.getHistoriesAsFemale().add(history);
        userRepository.save(female);
        faceChatRepository.saveFaceChatOrHistory(history);
    }

    public void updateWantsFriend(Integer faceChatId, Integer myId, Integer partnerId, boolean friend){
        FaceChat faceChat = faceChatRepository.findById(faceChatId).orElseThrow(FaceChatNotFoundException::new);
        User me = userRepository.findById(myId).orElseThrow(() -> new UserNotFoundException(myId));
        User partner = userRepository.findById(partnerId).orElseThrow(() -> new UserNotFoundException(partnerId));
        WantsFriendType wantsFriend = friend ? WantsFriendType.YES : WantsFriendType.NO;

        Male m;
        Female f;

        if(me instanceof Male){
            m = (Male)me;
            f = (Female)partner;
        }
        else if(me instanceof Female){
            m = (Male)partner;
            f = (Female)me;
        }
        else
            throw new InvalidGenderException();

        if(!faceChat.getMale().equals(m) || !faceChat.getFemale().equals(f)){
            throw new FaceChatNotFoundException();
        }

        faceChat.setWantsFriend(me, wantsFriend);
        faceChatRepository.saveAndFlush(faceChat);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW, isolation = Isolation.READ_UNCOMMITTED)
    public Integer finishFaceChat(Integer faceChatId, Integer myId, Integer partnerId) {
        Male m;
        Female f;

        User me = userRepository.findById(myId).orElseThrow(() -> new UserNotFoundException(myId));
        User partner = userRepository.findById(partnerId).orElseThrow(() -> new UserNotFoundException(partnerId));

        if(me instanceof Male){
            m = (Male)me;
            f = (Female)partner;
        }
        else if(me instanceof Female){
            m = (Male)partner;
            f = (Female)me;
        }
        else
            throw new InvalidGenderException();

        Integer result = null;

        FaceChat updatedFaceChat = faceChatRepository.findById(faceChatId).orElseThrow(FaceChatNotFoundException::new);
//        log.info("User Info - my id : " + myId + ", partner id : " + partnerId);
//        log.info("updatedFaceChat.getMaleWantsFriend() = " + updatedFaceChat.getMaleWantsFriend());
//        log.info("updatedFaceChat.getFemaleWantsFriend() = " + updatedFaceChat.getFemaleWantsFriend());

        WantsFriendType maleWantsFriend = updatedFaceChat.getMaleWantsFriend();
        WantsFriendType femaleWantsFriend = updatedFaceChat.getFemaleWantsFriend();

        if (maleWantsFriend != null && femaleWantsFriend != null) {
            if (maleWantsFriend == WantsFriendType.YES && femaleWantsFriend == WantsFriendType.YES) {
                me.increaseSuccessCount();

                result = friendService.join(new SearchTargetDto(m.getId(), f.getId()));
            }
            quitUser(myId);
        }

        return result;
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

    @Transactional(readOnly = true)
    public Integer countAllFaceChat() {
        return faceChatRepository.countAll();
    }

    @Transactional(readOnly = true)
    public Integer countAllAvailableFaceChat(Integer userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));
        String gender = getGender(user).orElseThrow(InvalidGenderException::new);

        return faceChatRepository.countAllAvailable(gender);
    }
}
