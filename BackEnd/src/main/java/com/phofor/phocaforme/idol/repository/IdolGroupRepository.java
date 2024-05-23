package com.phofor.phocaforme.idol.repository;

import com.phofor.phocaforme.idol.entity.IdolGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IdolGroupRepository extends JpaRepository<IdolGroup, Long> {

    List<IdolGroup> findAll();  // 모든 아이돌 그룹 리스트 불러오기
}
