package com.phofor.phocaforme.chat.repository;

import com.phofor.phocaforme.chat.dto.response.ChatMessageResponseDto;
import com.phofor.phocaforme.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query("""
        SELECT new com.phofor.phocaforme.chat.dto.response.ChatMessageResponseDto
        (c.chatRoomId, c.senderId, c.message, c.imgCode, c.createdAt)
        From ChatMessage  c
        WHERE c.chatRoomId = :chatRoomId
        order by c.id
    """)
    List<ChatMessageResponseDto> findAllByChatRoomId(@Param("chatRoomId") Long chatRoomId);
}
