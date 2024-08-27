package com.ssafy.whoareyou.friend.repository;

import com.ssafy.whoareyou.friend.dto.FriendUserDto;
import com.ssafy.whoareyou.friend.entity.Friend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendJpaRepository extends JpaRepository<Friend, Integer> {
    @Query("select new com.ssafy.whoareyou.friend.dto.FriendUserDto(f.female.id, f.female.nickname) from Friend f " +
            "where f.male.id = :maleId")
    List<FriendUserDto> findFemaleByMaleId(@Param("maleId") int maleId);

    @Query("select new com.ssafy.whoareyou.friend.dto.FriendUserDto(f.male.id, f.male.nickname) from Friend f " +
            "where f.female.id = :femaleId")
    List<FriendUserDto> findMaleByFemaleId(@Param("femaleId") int femaleId);

    @Query("select f from Friend f " +
            "where f.male.id = :maleId and f.female.id = :femaleId ")
    Optional<Friend> findByGenderId(@Param("maleId") int maleId, @Param("femaleId") int femaleId);
}
