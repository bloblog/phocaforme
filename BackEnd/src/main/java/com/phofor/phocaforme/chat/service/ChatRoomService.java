package com.phofor.phocaforme.chat.service;

import com.phofor.phocaforme.auth.domain.CustomOAuth2User;
import com.phofor.phocaforme.chat.dto.response.ChatRoomResponseDto;

import java.util.List;

public interface ChatRoomService {

    // 방 있는지 체크해서 방 만들어주기
    ChatRoomResponseDto getChatRoomByBoardIdAndVisiterId(Long boardId, CustomOAuth2User customOAuth2User);

    // 유저의 채팅 내역 모두 가져오기
    List<ChatRoomResponseDto> getAllByOwnerIdOrVisiterId(CustomOAuth2User customOAuth2User);

    // 마지막 채팅 업데이트
    Boolean updateLatestChat(String userId, Long chatroomId);

    // 채팅방 만들기
//    @Transactional
//    ChatRoomResponseDto getChatRoomByBoardIdAndVisiterId(ChatRoomRequestDto chatRoomRequestDto, Long boardId, String userId);
}
