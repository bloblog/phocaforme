package com.phofor.phocaforme.board.repository;

import com.phofor.phocaforme.board.entity.Barter;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BarterRepository extends JpaRepository<Barter, Long> {

//    @Query("select " +
//            "from Barter b join fetch b.findIdols" +
//            "where b.id = ?")
//    List<BarterDetailDto>
//    @Query()
//    Optional<Barter> findByIdWithIdolMembers(@Param("id") Long id);

   Optional<Barter> findById(Long id);

}
