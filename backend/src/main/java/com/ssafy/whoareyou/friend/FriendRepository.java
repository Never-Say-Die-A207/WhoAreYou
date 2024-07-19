package com.ssafy.whoareyou.friend;

import com.ssafy.whoareyou.user.User;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class FriendRepository {
    private final EntityManager em;

    public List<Friend> findAllById(int userId){
        return em.createQuery("select f from Friend f join f.from u on u.id = :userId", Friend.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    public Friend findOne(long friendId){
        return em.find(Friend.class, friendId);
    }

    public void delete(Friend findFriend) {
        em.remove(findFriend);
    }
}
