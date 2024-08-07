package com.ssafy.whoareyou.facechat.entity;

import com.ssafy.whoareyou.user.entity.Female;
import com.ssafy.whoareyou.user.entity.Male;
import com.ssafy.whoareyou.user.entity.User;
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
    private Male male;

    private String maleMask;

    @Enumerated(EnumType.STRING)
    private WantsFriendType maleWantsFriend;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="female_id")
    private Female female;

    private String femaleMask;

    @Enumerated(EnumType.STRING)
    private WantsFriendType femaleWantsFriend;

    public void joinUser(User user, String mask){
        boolean isEmptyRoom = true;

        if(user instanceof Male m){
            this.male = m;
            this.maleMask = mask;
            m.setFaceChatAsMale(this);
            if(this.getFemale() != null)
                isEmptyRoom = false;
        }
        else if (user instanceof Female f){
            this.female = f;
            this.femaleMask = mask;
            f.setFaceChatAsFemale(this);
            if(this.getMale() != null)
                isEmptyRoom = false;
        }

        if(isEmptyRoom)
            this.createdAt = LocalDateTime.now();
        else{
            if(this.startedAt == null)
                this.startedAt = LocalDateTime.now();
            updateMatchingCount();
        }
    }

    public Boolean removeUser(User user){
        if(user instanceof Male m){
            this.male = null;
            this.maleMask = null;
            m.setFaceChatAsMale(null);

            if(this.getFemale() == null)
                return true;
        }
        else if (user instanceof Female f){
            this.female = null;
            this.femaleMask = null;
            f.setFaceChatAsFemale(null);

            if(this.getMale() == null)
                return true;
        }
        
        //혼자 남은 참가자는 다시 매칭
        this.createdAt = LocalDateTime.now();
        this.startedAt = null;

        return false;
    }

    public void updateMatchingCount() {
        this.getMale().increaseMatchingCount();
        this.getFemale().increaseMatchingCount();
    }

    public void setWantsFriend(User me, WantsFriendType wantsFriend) {
        if(me instanceof Male m)
            this.maleWantsFriend = wantsFriend;
        else
            this.femaleWantsFriend = wantsFriend;
    }

}
