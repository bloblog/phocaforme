package com.phofor.phocaforme.chat.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatRoomRequestDto {
    // 내가 채팅방을 만들 때 전해줘야 할 것
    // 게시물->채팅방 가는 순서
    // 게시물id, 게시물 제목, owner, visiter,
    private Long boardId;
    private String boardTitle;
    private String ownerId;
    private String visiterId;
}
