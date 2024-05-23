package com.phofor.phocaforme.wishcard.repository;

import com.phofor.phocaforme.wishcard.entity.WishCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WishCardRepository extends JpaRepository<WishCard, String> {

    Optional<WishCard> findByUserEntity_UserId(String userId);

    void deleteByUserEntity_UserId(String userId);
}
