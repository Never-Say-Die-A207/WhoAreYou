package com.ssafy.whoareyou.facechat.repository;

import com.ssafy.whoareyou.facechat.entity.FaceChat;
import com.ssafy.whoareyou.facechat.entity.History;
import com.ssafy.whoareyou.user.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.NonUniqueResultException;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

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

    public void delete(Object object) {
        log.info("FaceChat : Delete face chat");
        em.remove(object);
    }

    //test
    public FaceChat findAvailable(User user) throws NoResultException, IllegalArgumentException {
//        String queryString = "select fc from FaceChat fc where fc." + gender + " is null";
        String myGender = user.getGender();
        if(!(myGender.equals("male") || myGender.equals("female")))
            throw new IllegalArgumentException("Wrong gender type : " + myGender);

        String yourGender = user.getGender().equals("male") ? "female" : "male";

        String queryString = "select fc from FaceChat fc" +
                              " where fc." + myGender+ " is null" +
                              " and fc." + yourGender + " not in :mustNotMatch" +
                              " order by fc.createdAt";

        return em.createQuery(queryString, FaceChat.class)
                .setFirstResult(0)
                .setMaxResults(1)
                .getSingleResult();
    }


    public FaceChat findFirstFaceChatByGender(String gender, Integer lastFaceChatId) throws NoResultException {
        log.info("FaceChat : Find first face chat by Gender " + gender);
        String queryString = "select fc from FaceChat fc where fc." + gender + " is null";
//        String queryString = "select fc from FaceChat fc" +
//                              " where fc." + user.getGender() + " is null" +
//                              " and fc not in :recentFaceChats"
        //queryString += " and
        if(lastFaceChatId != null){
            queryString += " and fc.id != :lastId";
        }
        log.info("Last FaceChatId : " + lastFaceChatId);
        queryString += " order by fc.createdAt";
        TypedQuery<FaceChat> query = em.createQuery(queryString, FaceChat.class);
        if(lastFaceChatId != null)
            query.setParameter("lastId", lastFaceChatId);
        return query
                .setFirstResult(0)
                .setMaxResults(1)
                .getSingleResult();
    }

    public FaceChat findCurrentFaceChat(User user) throws NoResultException, NonUniqueResultException {
        log.info("FaceChat : Find current face chat by User " + user.getId());
        return em.createQuery("select fc from FaceChat fc where fc." + user.getGender() + " = :user", FaceChat.class)
                .setParameter("user", user)
                .getSingleResult();
    }

    public FaceChat findOne(int faceChatId) {
        return em.find(FaceChat.class, faceChatId);
    }
}
