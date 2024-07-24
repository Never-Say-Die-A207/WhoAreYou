package com.ssafy.whoareyou.user;

import com.ssafy.whoareyou.dto.request.auth.SignUpRequestDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name="user")
@Table(name="user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(nullable = false, length = 20)
    private String name;

    @Column(nullable = false, length = 20)
    private String nickname;

    @Column(nullable = false, length = 20)
    private String gender;

    @Column(name = "total_matching_count", nullable = false, columnDefinition = "int default 0")
    private int totalMatchingCount;

    @Column(nullable = false, length = 10)
    private String type; //"general", "kakao", "naver"

    public User(SignUpRequestDto dto){
        this.email = dto.getEmail();
        this.name = dto.getName();
        this.nickname = dto.getNickname();
        this.gender = dto.getGender();
        this.totalMatchingCount = 0;
        this.type = "general";
    }
}
