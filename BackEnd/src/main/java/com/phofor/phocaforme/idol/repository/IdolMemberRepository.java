package com.phofor.phocaforme.idol.repository;

import com.phofor.phocaforme.idol.dto.IdolMemberDTO;
import com.phofor.phocaforme.idol.entity.IdolMember;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IdolMemberRepository extends JpaRepository<IdolMember, Long> {

    // 해당하는 그룹의 아이돌 멤버 가져오기
    List<IdolMember> findAllByIdolGroupId(@Param("idolGroup") Long idolGroupId);

    Optional<IdolMember> findIdolMemberById(Long memberId);

    @Query("SELECT im.id " +
            "FROM IdolMember im JOIN im.idolGroup ig " +
            "WHERE ig.gender = 'female' " +
            "ORDER BY im.searchCount DESC")
    List<Long> findFemaleTop3(Pageable pageable);
    // new com.phofor.phocaforme.idol.dto.IdolMemberDTO(im.id,im.name,im.searchCount)
    @Query("SELECT im.id " +
            "FROM IdolMember im JOIN im.idolGroup ig " +
            "WHERE ig.gender = 'male' " +
            "ORDER BY im.searchCount DESC")
    List<Long> findMaleTop3(Pageable pageable);

}
