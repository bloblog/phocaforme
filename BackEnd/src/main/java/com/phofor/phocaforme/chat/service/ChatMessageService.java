package com.phofor.phocaforme.chat.service;

import com.phofor.phocaforme.chat.dto.request.ChatMessageRequestDto;
import com.phofor.phocaforme.chat.dto.response.ChatMessageResponseDto;

import java.util.List;
import java.util.Map;

public interface ChatMessageService {
    ChatMessageResponseDto save(ChatMessageRequestDto chatMessageRequestDto, Long chatMessageRoomId, Map<String, Object> headers);

    // 채팅 내역 조회
    List<ChatMessageResponseDto> getAllByChatRoomId(Long chatRoomId);

    // 채팅방의 마지막 메시지 내역 반환
    //ChatMessageResponseDto getLastChatId(Long chatId);

    // 교환 완료 업데이트
    Boolean updateBarterStatus(Long chatRoomId);
}
