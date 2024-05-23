package com.phofor.phocaforme.board.repository;

import com.phofor.phocaforme.board.entity.Barter;
import com.phofor.phocaforme.board.entity.BarterOwnIdol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BarterOwnIdolRepository extends JpaRepository<BarterOwnIdol, Long> {
    List<BarterOwnIdol> findByBarter(Barter barter);
}
