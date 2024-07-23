package com.ssafy.whoareyou.facechat;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Repository
@RequiredArgsConstructor
@Transactional
public class FaceChatRepository {
    private final EntityManager em;

    @Transactional(readOnly = true)
    public FaceChat findRoomByGender(String gender) {
        List<FaceChat> findRooms = em.createQuery("select fc from FaceChat fc"
                        + " join fc.host h on h.gender != :gender order by fc.createdAt", FaceChat.class)
                .setParameter("gender", gender)
                .getResultList();

        if(findRooms.isEmpty())
            return null;
        else
            return findRooms.get(0);
    }

    public void save(FaceChat room) {
        em.persist(room);
    }

    public void deleteRoom(FaceChat room) {
        em.remove(room);
    }
}
