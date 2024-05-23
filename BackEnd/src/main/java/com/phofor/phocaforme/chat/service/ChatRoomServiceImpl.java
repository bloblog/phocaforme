package com.phofor.phocaforme.chat.service;

import com.phofor.phocaforme.auth.domain.CustomOAuth2User;
import com.phofor.phocaforme.auth.service.redis.RedisService;
import com.phofor.phocaforme.board.entity.Barter;
import com.phofor.phocaforme.board.repository.BarterRepository;
import com.phofor.phocaforme.chat.dto.response.ChatRoomResponseDto;
import com.phofor.phocaforme.chat.entity.ChatRoom;
import com.phofor.phocaforme.chat.exception.BarterBoardNotFoundException;
import com.phofor.phocaforme.chat.exception.ChatRoomNotFoundException;
import com.phofor.phocaforme.chat.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@Transactional // 한 사이클 안에서 디비 관리해주는거
// 터지면 이제 아무것도 안됨요
@RequiredArgsConstructor
public class ChatRoomServiceImpl implements ChatRoomService{

    private final ChatRoomRepository chatRoomRepository;
    private final RedisService redisService;

    private final BarterRepository barterRepository;

    //CustomOAuth2User customOAuth2User = (CustomOAuth2User) redisService.getMapData(accessToken).get("oauth2User");
//        UserEntity userEntity = customOAuth2User.getUserEntity();
//        String userId = userEntity.getUserId();
//        String userName = userEntity.getUserName();
//        log.info(userName);

    // 채팅방 내역 조회
    @Override
    public List<ChatRoomResponseDto> getAllByOwnerIdOrVisiterId(CustomOAuth2User customOAuth2User) {
        String userId = customOAuth2User.getUserEntity().getUserId();
        log.info(userId);
        List<ChatRoomResponseDto> allChatRoomDto = new ArrayList<>();
        for (ChatRoom c : chatRoomRepository.findAllByOwnerIdOrVisiterIdOrderByChatLatestDesc(userId, userId)) {
            allChatRoomDto.add(ChatRoomResponseDto.of(c));
        }
        return allChatRoomDto;
    }

    // 채팅방 만들기
    @Override
    @Transactional
    public ChatRoomResponseDto getChatRoomByBoardIdAndVisiterId(Long boardId, CustomOAuth2User customOAuth2User){
        String userId = customOAuth2User.getUserEntity().getUserId();
        ChatRoom chatRoom = chatRoomRepository.findChatRoomByBoardIdAndVisiterId(boardId, userId);
        // 나중에 게시글이 생기면 사용할 수 있어요~~
//        private final BartarRepository bartarRepository;
        Barter barter = barterRepository.findById(boardId).orElseThrow(BarterBoardNotFoundException::new);
        // Optional<~> : 이 뒤에 null이 발생할 경우 다른 동작을 어떻게 할지 결정할 수 있음
        System.out.println("chatRoom = " + chatRoom);
        
        if(chatRoom==null){ // 해당하는 채팅방이 없을 경우 새로 만들어주기
            // save
            // ChatRoomResponseDto chatRoomResponseDto = new ChatRoomResponseDto(chatRoomRequestDto);

            ChatRoom saveChatRoom = ChatRoom.builder()
                    .boardId(barter.getId())
                    .boardTitle(barter.getTitle())
//                    .ownerId("4df5a517-fd37-4175-a0f6-0ea843899d34")
                    .ownerId(barter.getUser().getUserId())
                    .visiterId(userId)
                    .build();

//            ChatRoom saveChatRoom = ChatRoom.builder()
//                    .boardId(chatRoomRequestDto.getBoardId())
//                    .boardTitle(chatRoomRequestDto.getBoardTitle())
//                    .ownerId(chatRoomRequestDto.getOwnerId())
//                    .visiterId(chatRoomRequestDto.getVisiterId())
//                    .build();
            chatRoom = chatRoomRepository.save(saveChatRoom);
        }
        ChatRoomResponseDto singleChatRoomDto = ChatRoomResponseDto.of(chatRoom);
        return singleChatRoomDto;
    }

    @Override
    public Boolean updateLatestChat(String userId, Long chatroomId) {
        try {
            ChatRoom chatRoom = chatRoomRepository.findById(chatroomId).orElseThrow(ChatRoomNotFoundException::new);
            if (chatRoom.getOwnerId().equals(userId)){
                chatRoom.setOwnerLatestId(chatRoom.getChatLatest().getId());
            } else {
                chatRoom.setVisitorLatestId(chatRoom.getChatLatest().getId());
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
