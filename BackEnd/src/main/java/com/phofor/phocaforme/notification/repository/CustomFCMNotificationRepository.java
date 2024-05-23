package com.phofor.phocaforme.notification.repository;

import java.util.List;

public interface CustomFCMNotificationRepository {
    List<String> findDeviceTokensByIds(List<String> ids);
}
