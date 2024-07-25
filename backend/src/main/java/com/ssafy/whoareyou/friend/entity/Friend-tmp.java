//package com.ssafy.whoareyou.entity;
//
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Getter
//@NoArgsConstructor
//public class Friend {
//    @Id @GeneratedValue
//    private Long id;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "male_id")
//    private User male;
//    private String maleMask;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "female_id")
//    private User female;
//    private String femaleMask;
//
//    private LocalDateTime createdAt;
//
//    public Friend(User male, String maleMask, User female, String femaleMask){
//        this.male = male;
//        this.maleMask = maleMask;
//        this.female = female;
//        this.femaleMask = femaleMask;
//        this.createdAt = LocalDateTime.now();
//    }
//}
