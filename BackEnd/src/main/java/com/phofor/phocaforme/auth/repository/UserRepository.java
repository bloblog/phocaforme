package com.phofor.phocaforme.auth.repository;

import com.phofor.phocaforme.auth.entity.UserEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;
import java.util.Optional;

/**
 * Spring Data JPA
 */
@Repository
public interface UserRepository extends CrudRepository<UserEntity, String> {
    Optional<UserEntity> findByEmailAndOauthType(String email, String oauthType);
    Optional<UserEntity> findByUserId(String userId);
    Optional<UserEntity> findByKakaoId(String kakaoId);
    Optional<UserEntity> findByNickname(String nickname) throws SQLException;
}
