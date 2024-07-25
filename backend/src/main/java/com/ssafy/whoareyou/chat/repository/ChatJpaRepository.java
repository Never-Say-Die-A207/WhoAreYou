package com.ssafy.whoareyou.chat.repository;

import com.ssafy.whoareyou.chat.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatJpaRepository extends JpaRepository<Chat, Integer>{
    @Query(value = "select c.* from chat c " +
            "inner join chat_room cr on cr.id = c.chat_room_id " +
            "where cr.id = :roomId ", nativeQuery = true)
    List<Chat> findByRoomId(int roomId);
}
