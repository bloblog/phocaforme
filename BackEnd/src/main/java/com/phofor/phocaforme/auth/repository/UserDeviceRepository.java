package com.phofor.phocaforme.auth.repository;

import com.phofor.phocaforme.auth.entity.UserDeviceEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserDeviceRepository extends CrudRepository<UserDeviceEntity, String> {
    Optional<UserDeviceEntity> findByUserId(String userId);

    void deleteByUserId(String userId);
}
