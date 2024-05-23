package com.phofor.phocaforme.chat.controller;

import com.phofor.phocaforme.auth.util.CookieUtil;
import com.phofor.phocaforme.board.dto.BarterRegisterDto;
import com.phofor.phocaforme.chat.dto.request.ChatMessageRequestDto;
import com.phofor.phocaforme.chat.dto.response.ChatMessageResponseDto;
import com.phofor.phocaforme.chat.service.ChatMessageService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
//@CrossOrigin(origins="http://localhost:8080", allowedHeaders = "http://localhost:3000", allowCredentials = "true")
@Controller
public class ChatMessageController {
    private final SimpMessageSendingOperations messagingTemplate;
    private final ChatMessageService chatMessageService;
    private Cookie tokenCookie;

    @GetMapping("/chats/{chatRoomId}")
    public ResponseEntity<List<ChatMessageResponseDto>> getChatMessageAll(@PathVariable Long chatRoomId) {
        return ResponseEntity.ok().body(chatMessageService.getAllByChatRoomId(chatRoomId));
    }

    @MessageMapping("/chats/{chatRoomId}")  // 일단 이건 지금 이 상태가 맞음(별걸로 다 바꾸면 안되더라)
//    @SendTo("/topic/public/{chatRoomId}")
    @SendTo("/sub/chat/room{chatRoomId}")
    public ChatMessageResponseDto sendMessage(@DestinationVariable Long chatRoomId,
                                              @Header("simpSessionAttributes") Map<String, Object> simpSessionAttributes,
                                              @Payload ChatMessageRequestDto chatMessageRequestDto) {
        //log.info(chatMessageRequestDto.getMessage());
        // Redis로 유저 정보 뽑아오기
        //tokenCookie = CookieUtil.resolveToken(request);
        //log.info(tokenCookie.getValue());
        return chatMessageService.save(chatMessageRequestDto, chatRoomId, simpSessionAttributes);
    }

    // 교환 완료 버튼 클릭
    @PutMapping("/chats/done/{chatRoomId}")
    public ResponseEntity<?> completeBarter(@PathVariable Long chatRoomId){
        chatMessageService.updateBarterStatus(chatRoomId);
        return new ResponseEntity<>(HttpStatus.OK);
    }


//    @PutMapping("/chat/{chatId}")
//    public ResponseEntity<ChatMessageResponseDto> (@PathVariable Long chatId){
//        return ResponseEntity.ok().body(chatMessageService.get)
//    }
}
