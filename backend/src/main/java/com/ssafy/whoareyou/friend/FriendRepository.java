package com.ssafy.whoareyou.friend;

import com.ssafy.whoareyou.entity.Friend;
import com.ssafy.whoareyou.entity.User;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class FriendRepository {
    private final EntityManager em;

    public List<Friend> findAllByGender(User user){
        return em.createQuery("select f from Friend f where f." + user.getGender() + " = :user", Friend.class)
                .setParameter("user", user)
                .getResultList();
    }

    public void save(Friend friend) {
        em.persist(friend);
    }

//    public Friend findOne(long friendId){
//        return em.find(Friend.class, friendId);
//    }
//
//    public void delete(Friend findFriend) {
//        em.remove(findFriend);
//    }
//
//    public List<Friend> findAllById(int userId){
//        return em.createQuery("select f from Friend f join f.from u on u.id = :userId", Friend.class)
//                .setParameter("userId", userId)
//                .getResultList();
//    }
}
