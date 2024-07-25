package com.ssafy.whoareyou.chat.repository;

import com.ssafy.whoareyou.chat.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserJpaRepository extends JpaRepository<User, Integer> {
    Optional<User> findById(int userId);

}
