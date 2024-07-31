package com.ssafy.whoareyou.chat.repository;

import com.ssafy.whoareyou.chat.entity.mongo.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ChatMongoRepository extends MongoRepository<Chat, String> {
    @Query("{ 'roomId' : ?0 }")
    List<Chat> findByRoomId(int roomId);
}
