package com.ssafy.whoareyou.facechat;

import com.ssafy.whoareyou.user.User;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;

@Entity
@Getter
public class FaceChat {

    @Id @GeneratedValue
    private Integer id;

    private LocalDateTime createdAt;
    private LocalDateTime startedAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="male_id")
    private User male;
    private String maleMask; //나중에 별도의 클래스로 분리

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="female_id")
    private User female;
    private String femaleMask;

    public static FaceChat createFaceChat(User user, String mask){
        FaceChat faceChat = new FaceChat();
        if(user.getGender().equals("male")){
            faceChat.male = user;
            faceChat.maleMask = mask;
            user.setFaceChatAsMale(faceChat);
        }
        else{
            faceChat.female = user;
            faceChat.femaleMask = mask;
            user.setFaceChatAsFemale(faceChat);
        }
        faceChat.createdAt = LocalDateTime.now();
        return faceChat;
    }

    public void joinUser(User user, String mask){
        if(user.getGender().equals("male")){
            this.male = user;
            this.maleMask = mask;
            user.setFaceChatAsMale(this);
        }
        else{
            this.female = user;
            this.femaleMask = mask;
            user.setFaceChatAsFemale(this);
        }
        this.startedAt = LocalDateTime.now();
    }

    public Boolean removeUser(User user){
        if(user.getGender().equals("male")){
            if(this.getFemale() == null)
                return true;

            this.male = null;
            this.maleMask = null;
            user.setFaceChatAsMale(null);
        }
        else{
            if(this.getMale() == null)
                return true;

            this.female = null;
            this.femaleMask = null;
            user.setFaceChatAsFemale(null);
        }
        
        //혼자 남은 참가자는 다시 매칭
        this.createdAt = LocalDateTime.now();
        this.startedAt = null;

        return false;
    }

    public void updateMatchingCount() {
        this.male.increaseMatchingCount();
        this.female.increaseMatchingCount();
    }
}
