package com.ssafy.whoareyou.user;

import com.ssafy.whoareyou.entity.User;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@RequiredArgsConstructor
@Transactional
public class UserRepository {
    private static final Logger log = LoggerFactory.getLogger(UserRepository.class);
    private final EntityManager em;

    public void save(User user) {
        log.info("User : Save or Merge user");
        if(user.getId() == null){
            em.persist(user);
        }
        else{
            em.merge(user);
        }
    }

    public User findOne(int userId) {
        log.info("User : Find user");
        return em.find(User.class, userId);
    }
}
