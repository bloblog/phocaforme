package com.phofor.phocaforme.notification.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CustomFCMNotificationRepositoryImpl implements CustomFCMNotificationRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<String> findDeviceTokensByIds(List<String> ids) {
        TypedQuery<String> query = entityManager.createQuery(
                "SELECT ud.deviceToken FROM UserDeviceEntity ud WHERE ud.userId IN :ids", String.class);
        query.setParameter("ids", ids);
        return query.getResultList();
    }

}