package com.phofor.phocaforme.notification.dto;

import com.phofor.phocaforme.notification.entity.NotificationType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class NotificationDto {
    private NotificationType notificationType; //알림 타입 
    private String senderId;    // 보낸 사람
    private String receiverId;  // 받은 사람
    private String title;   // 제목
    private String content; // 내용
    private String link;    // 링크
    private Long articleId; // 게시물 번호
    private List<String> ids; // 받는 사람들

    private String ownerId;
    private String visitedId;
    private String userId;
}
