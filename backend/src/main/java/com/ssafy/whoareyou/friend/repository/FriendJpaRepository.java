package com.ssafy.whoareyou.friend.repository;

import com.ssafy.whoareyou.friend.entity.Friend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendJpaRepository extends JpaRepository<Friend, Integer> {
    @Query(value = "select * from friend where user_id = :userId and chat_room_id = :chatRoomId", nativeQuery = true)
    Optional<Friend> findByIds(int userId, int chatRoomId);

    @Query(value = "select * from friend where user_id = :userId", nativeQuery = true)
    List<Friend> findListByUserId(int userId);
}
