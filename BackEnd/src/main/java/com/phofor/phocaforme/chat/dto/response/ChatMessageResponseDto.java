package com.phofor.phocaforme.chat.dto.response;

import com.phofor.phocaforme.chat.dto.request.ChatMessageRequestDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponseDto {
    private Long chatRoomId;
    private String userEmail;
    private String message;
    private String imgCode;
    private LocalDateTime createdAt;    // 안되면 지워

    public ChatMessageResponseDto(ChatMessageRequestDto chatMessageRequestDto) {
        this.chatRoomId = chatMessageRequestDto.getChatRoomId();
        this.userEmail = chatMessageRequestDto.getUserEmail();
        this.message = chatMessageRequestDto.getMessage();
        this.imgCode = chatMessageRequestDto.getImgCode();

    }
}
