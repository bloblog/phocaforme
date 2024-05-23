package com.phofor.phocaforme.chat.repository;

import com.phofor.phocaforme.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

//    @Query("""
//            SELECT new com.example.chatimage.chat.dto.response.ChatRoomResponseDto
//            (cr.boardId, cr.boardTitle, cr.ownerId, cr.visiterId)
//            From ChatRoom cr
//            WHERE cr.ownerId = :userId or cr.visiterId = :userId
//            order by cr.createdAt
//            """)
    // ownerId나 visiterId와 userId가 같은거 불러오기
    List<ChatRoom> findAllByOwnerIdOrVisiterIdOrderByChatLatestDesc(@Param("userId") String ownerId, @Param("userId") String visiterId);

//    @Query("""
//        SELECT new com.example.chatimage.chat.dto.response.ChatRoomResponseDto
//        (chatRoom.boardId, chatRoom.boardTitle, chatRoom.ownerId, chatRoom.visiterId)
//        from ChatRoom chatRoom
//        WHERE chatRoom.boardId = :boardId and chatRoom.visiterId = :userId
//    """)
    // 채팅방 있니?
    ChatRoom findChatRoomByBoardIdAndVisiterId(@Param("boardId") Long boardId, @Param("userId") String visiterId);

    // 교환 완료 할 채팅방 얻어오기
    ChatRoom findChatRoomByChatRoomId(@Param("chatRoomId") Long chatRoomId);
}
