package com.phofor.phocaforme.notification.entity;


import com.phofor.phocaforme.auth.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SourceType;

import java.time.LocalDateTime;

import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = PROTECTED)
@Table(name = "notification")
public class NotificationEntity {

    @Id
    @Column(name = "notification_id")
    @GeneratedValue(strategy = IDENTITY)
    private Long notificationId; // 알림 번호

    @ManyToOne
    @JoinColumn(name = "notification_user_id", columnDefinition = "CHAR(50)", nullable = false)
    private UserEntity userEntity;  // 회원

    @Column(name = "notification_title", columnDefinition = "VARCHAR(50)", nullable = false)
    private String title; // 알림 내용

    @Column(name = "notification_content", columnDefinition = "VARCHAR(100)", nullable = false)
    private String content; // 알림 내용

    @CreationTimestamp(source = SourceType.DB)
    @Column(name = "notification_created_at", nullable = false)
    private LocalDateTime createdAt;    // 생성시간

    @Column(name = "notification_read_status", columnDefinition = "Boolean", nullable = false)
    private Boolean readStatus;

    @Enumerated(value = EnumType.STRING)
    @Column(name="notification_type",columnDefinition = "ENUM", nullable = false)
    private NotificationType notificationType;

    @Column(name="notification_article_id", columnDefinition = "BIGINT")
    private Long articleId;

    @Column(name="notification_delete_status", columnDefinition = "Boolean", nullable = false)
    private Boolean deleteStatus;

}
