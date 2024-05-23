package com.phofor.phocaforme.board.repository;

import com.phofor.phocaforme.board.entity.Barter;
import com.phofor.phocaforme.board.entity.BarterImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BarterImageRepository extends JpaRepository<BarterImage, Long> {
    List<BarterImage> findByBarter(Barter barter);
}
