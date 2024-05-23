package com.phofor.phocaforme.notification.dto.message;


import com.phofor.phocaforme.notification.entity.NotificationType;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class NotificationMessageDto {
    private final Long notificationId; // 알림 번호
    private final String content; // 알림 내용
    private final LocalDateTime createdAt; // 생성시간
    private final Boolean readStatus; // 읽음 상태
    private final NotificationType notificationType; // 알림 타입
    private final Long articleId; // 관련 게시글 ID

    public NotificationMessageDto(Long notificationId, String content, LocalDateTime createdAt, Boolean readStatus, NotificationType notificationType, Long articleId) {
        this.notificationId = notificationId;
        this.content = content;
        this.createdAt = createdAt;
        this.readStatus = readStatus;
        this.notificationType = notificationType;
        this.articleId = articleId;
    }
}
