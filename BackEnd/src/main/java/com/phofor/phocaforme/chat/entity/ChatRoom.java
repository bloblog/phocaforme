package com.phofor.phocaforme.chat.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
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
@DynamicUpdate  // null인 친구들은 업데이트에 포함시키지 않아요~~(@Dynamic~~)
@DynamicInsert
@NoArgsConstructor(access = PROTECTED)
@Table(name = "barter_chat_room")
public class ChatRoom {
    @Id
    @Column(name = "barter_chat_room_id")
    @GeneratedValue(strategy = IDENTITY)
    private Long chatRoomId;   // 채팅방 아이디
    @Column(name = "barter_board_id")
    private Long boardId;    // 해당 교환 게시물 아이디
    @Column(name = "barter_owner_id")
    private String ownerId; // 게시글 작성자 아이디
    @Column(name = "barter_visitor_id")
    private String visiterId;   // 교환 희망자 아이디
    @Column(name = "barter_board_title")
    private String boardTitle;  // 게시글 제목
    @JoinColumn(name = "barter_latest_chat", referencedColumnName = "barter_chat_id")
    @ManyToOne // 나중에 barter_latest_chat 으로 바꿔주기
    private ChatMessage chatLatest;   // 마지막 채팅 아이디
    @Column(name = "barter_owner_latest_chat")
    private Long ownerLatestId;   // 게시글 작성자가 마지막으로 본 채팅id
    @Column(name = "barter_visitor_latest_chat")
    private Long visitorLatestId; // 교환 희망자가 마지막으로 본 채팅 id
    @CreationTimestamp(source = SourceType.DB)
    @Column(name = "barter_room_created_at")
    private LocalDateTime createdAt;    // 채팅방 생성일자
    @Column(name = "barter_chat_room_delete")
    private boolean deleteRoom;
}
