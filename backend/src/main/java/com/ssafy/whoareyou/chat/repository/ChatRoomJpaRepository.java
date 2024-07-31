package com.ssafy.whoareyou.chat.repository;

import com.ssafy.whoareyou.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatRoomJpaRepository extends JpaRepository<ChatRoom, Integer> {
    Optional<ChatRoom> findById(int id);

    @Query("select cr from ChatRoom cr " +
            "inner join Friend f on f.chatRoom.id = cr.id " +
            "where f.male.id = :maleId and f.female.id = :femaleId ")
    Optional<ChatRoom> findByGenderId(@Param("maleId") int maleId, @Param("femaleId")int femaleId);
}
