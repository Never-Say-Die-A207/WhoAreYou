package com.ssafy.whoareyou.chat.repository;

import com.ssafy.whoareyou.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatRoomJpaRepository extends JpaRepository<ChatRoom, Integer> {
    Optional<ChatRoom> findById(int id);

    @Query(value = "select cr.* from chat_room cr " +
            "inner join friend f on f.chat_room_id = cr.id " +
            "where f.male_id = :maleId and f.female_id = :femaleId ", nativeQuery = true)
    Optional<ChatRoom> findByGenderId(int maleId, int femaleId);
}
