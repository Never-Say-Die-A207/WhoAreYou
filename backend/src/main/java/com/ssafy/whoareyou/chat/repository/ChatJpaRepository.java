package com.ssafy.whoareyou.chat.repository;

import com.ssafy.whoareyou.chat.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatJpaRepository extends JpaRepository<Chat, Integer>{
    @Query("select c from Chat c " +
            "inner join ChatRoom cr on cr.id = c.chatRoom.id " +
            "where cr.id = :roomId ")
    List<Chat> findByRoomId(@Param("roomId") int roomId);
}
