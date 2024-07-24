package com.ssafy.whoareyou.facechat;

import com.ssafy.whoareyou.user.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.NonUniqueResultException;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class FaceChatRepository {
    private final EntityManager em;

    public void save(FaceChat faceChat) {
        if(faceChat.getId() == null)
            em.persist(faceChat);
        else
            em.merge(faceChat);
    }

    public void delete(FaceChat faceChat) {
        em.remove(faceChat);
    }

    public FaceChat findFirstFaceChatByGender(String gender, Integer lastFaceChatId) throws NoResultException {
        String queryString = "select fc from FaceChat fc where fc." + gender + " is null";
        if(lastFaceChatId != null){
            queryString += " and fc.id != :lastId";
        }
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
        return em.createQuery("select fc from FaceChat fc where fc." + user.getGender() + " = :user", FaceChat.class)
                .setParameter("user", user)
                .getSingleResult();
    }

}
