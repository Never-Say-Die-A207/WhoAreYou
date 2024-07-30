package com.ssafy.whoareyou.facechat.repository;

import com.ssafy.whoareyou.facechat.entity.FaceChat;
import com.ssafy.whoareyou.facechat.entity.History;
import com.ssafy.whoareyou.user.entity.Female;
import com.ssafy.whoareyou.user.entity.Male;
import com.ssafy.whoareyou.user.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import lombok.RequiredArgsConstructor;
import org.hibernate.NonUniqueResultException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class FaceChatRepository {
    private static final Logger log = LoggerFactory.getLogger(FaceChatRepository.class);
    private final EntityManager em;
    private final int timeLimit = 10;

    public void saveFaceChatOrHistory(Object object) {
        if(object instanceof FaceChat faceChat) {
            if(faceChat.getId() == null)
                em.persist(faceChat);
            else
                em.merge(faceChat);
        }
        else if(object instanceof History history) {
            em.persist(history);
        }
    }

    public void deleteFaceChat(FaceChat faceChat) {
        log.info("FaceChat : Delete face chat");
        em.remove(faceChat);
    }

    public Optional<FaceChat> findById(int id){
        log.info("FaceChat : findById");
        return Optional.of(em.find(FaceChat.class, id));
    }

    public FaceChat findAvailable(User user) throws NoResultException, IllegalArgumentException {

        String myGender = getGender(user);
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

        return em.createQuery(queryString, FaceChat.class)
                .setParameter("timeLimit", timeLimit)
                .setParameter("user", user)
                .setFirstResult(0)
                .setMaxResults(1)
                .getSingleResult();
    }

    public FaceChat findMy(User user) throws NoResultException, NonUniqueResultException,
            NullPointerException, IllegalArgumentException {
        log.info("FaceChat : Find current face chat by User " + user.getId());

        String myGender = getGender(user);

        return em.createQuery("select fc from FaceChat fc where fc." + myGender + " = :user", FaceChat.class)
                .setParameter("user", user)
                .getSingleResult();
    }

    private String getGender(User user) throws IllegalArgumentException{
        if(user instanceof Male)
            return "male";
        else if(user instanceof Female)
            return "female";
        throw new IllegalArgumentException("Wrong gender type");
    }
}
