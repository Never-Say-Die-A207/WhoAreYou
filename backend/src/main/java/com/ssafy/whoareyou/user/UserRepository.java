package com.ssafy.whoareyou.user;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@RequiredArgsConstructor
@Transactional
public class UserRepository {
    private final EntityManager em;

    public void save(User user) {
        if(user.getId() == null){
            em.persist(user);
        }
        else{
            em.merge(user);
        }
    }

    public User findOne(int userId) {
        return em.find(User.class, userId);
    }
}
