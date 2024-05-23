package com.phofor.phocaforme.chat.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatMessageRequestDto {
    private Long chatRoomId;
    private String userEmail;
    private String message; // 메시지
    private String imgCode; // 바이트 코드로 이미지를 받기
}
