package com.ssafy.whoareyou.facechat.repository;

import com.ssafy.whoareyou.facechat.entity.FaceChat;
import com.ssafy.whoareyou.facechat.entity.History;
import com.ssafy.whoareyou.user.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.NoResultException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class FaceChatRepository {
    private static final Logger log = LoggerFactory.getLogger(FaceChatRepository.class);
    private final EntityManager em;
    //private final int timeLimit = 10;
    private final int timeLimit = -1;

    public void saveHistory(History history) {
        em.persist(history);
    }

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    public void saveFaceChat(FaceChat faceChat) {
        if(faceChat.getId() == null)
            em.persist(faceChat);
        else
            em.merge(faceChat);
    }

    public void deleteFaceChat(FaceChat faceChat) {
        em.remove(faceChat);
    }

    public Optional<FaceChat> findById(int id){
        return Optional.of(em.find(FaceChat.class, id));
    }

    public Integer countAll() {
        return em.createQuery("select fc from FaceChat fc")
                .getResultList().size();
    }

    public Optional<List<FaceChat>> findAvailable(User user, String myGender) throws RuntimeException {
        String yourGender = myGender.equals("male") ? "female" : "male";

        String queryString = "select fc from FaceChat fc " +
                "where fc." + myGender + " is null " +
                "and fc." + yourGender + " not in " +
                "(select h." + yourGender + " from History h " +
                "where h." + myGender + " =:user " +
                "and function('timestampdiff', MINUTE, h.enteredAt, function('now')) <= :timeLimit " +
                "union " +
                "select f." + yourGender + " from Friend f " +
                "where f." + myGender + " =:user) " +
                "order by fc.createdAt";

            return Optional.of(em.createQuery(queryString, FaceChat.class)
                    .setParameter("timeLimit", timeLimit)
                    .setParameter("user", user)
                    .getResultList());
    }

    public Optional<FaceChat> findMy(User user, String myGender) throws RuntimeException {
        log.info("FaceChat : Find current face chat by User " + user.getId());

        try{
            return Optional.of(em.createQuery("select fc from FaceChat fc where fc." + myGender + " = :user", FaceChat.class)
                    .setParameter("user", user)
                    .getSingleResult());
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }
}
