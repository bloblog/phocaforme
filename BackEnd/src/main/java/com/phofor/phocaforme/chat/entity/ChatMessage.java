package com.phofor.phocaforme.chat.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SourceType;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = PROTECTED)
@Table(name = "barter_chat_messages")
public class ChatMessage {
    @Id
    @Column(name = "barter_chat_id")
    @GeneratedValue(strategy = IDENTITY)
    private Long id; // 채팅의 아이디
    @Column(name = "barter_chat_room_id")
    private Long chatRoomId; // 채티방의 아이디
    @Column(name = "barter_chat_sender_id")
    private String senderId;    // 채팅 보낸 사람의 아이디
//    @Column(name = "barter_chat_article_id")
//    private Long articleId;  // 게시글의 아이디

    @CreationTimestamp(source = SourceType.DB)
    @Column(name = "barter_chat_created_at")
    private LocalDateTime createdAt;    // 생성시간

    @Column(columnDefinition = "TEXT", name = "barter_chat_message")
    private String message; // 메시지
    @Column(name = "barter_chat_img_code")
    private String imgCode; // 바이트 코드로 이미지 받기

//    @Builder
//    public ChatMessage(Long id, Long chatRoomId, String senderId, Long articleId,
//                       String message, String imgCode, LocalDateTime createdAt) {
//        this.id = id;
//        this.chatRoomId = validateChatRoomId(chatRoomId);
//        this.senderId = validateSenderId(senderId);
//        this.articleId = validateArticleId(articleId);
//        this.message = validateMessage(message);
//        this.imgCode = imgCode;
//        this.createdAt = createdAt;
//    }

    // validate를 하고싶으면? request에다가 하기
//    private String validateSenderId(String senderId) {
//        notNull(senderId, "유효하지 않은 사용자 입니다.");
//        return senderId;
//    }
//
//    private Long validateChatRoomId(Long chatRoomId) {
//        notNull(chatRoomId, "유효하지 않은 채팅방입니다");
//        return chatRoomId;
//    }
//
//    private Long validateArticleId(Long articleId) {
//        notNull(articleId, "유효하지 않은 게시글입니다.");
//        return articleId;
//    }
//
//    private String validateMessage(String message) {
//        checkText(message, "채팅을 입력해 주세요.");
//        return message;
//    }
}
