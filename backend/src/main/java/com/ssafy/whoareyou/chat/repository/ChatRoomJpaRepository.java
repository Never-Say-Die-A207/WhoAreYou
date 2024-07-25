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
            "inner join friend r1 on r1.chat_room_id = cr.id " +
            "where r1.user_id = :userId1 " +
            "intersect " +
            "select cr.* from chat_room cr " +
            "inner join friend r2 on r2.chat_room_id = cr.id " +
            "where r2.user_id = :userId2 ", nativeQuery = true)
    Optional<ChatRoom> findByUserIds(int userId1, int userId2);
}
