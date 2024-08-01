package com.ssafy.whoareyou.chat.repository;

import com.ssafy.whoareyou.chat.entity.mongo.Chat;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ChatMongoRepository extends MongoRepository<Chat, String> {
    @Query("{chatRoomId :?0}")
    List<Chat> findByRoomId(int chatRoomId);

    @Modifying
    @Transactional
    @Query(value = "{chatRoomId :?0}", delete = true)
    void deleteByChatRoomId(int chatRoomId);
}
