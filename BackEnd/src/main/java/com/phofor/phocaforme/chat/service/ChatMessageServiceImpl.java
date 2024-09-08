package com.phofor.phocaforme.chat.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.phofor.phocaforme.auth.service.redis.RedisService;
import com.phofor.phocaforme.board.config.ApplicationEventPublisherHolder;
import com.phofor.phocaforme.board.dto.queueDTO.BarterMessage;
import com.phofor.phocaforme.board.entity.Barter;
import com.phofor.phocaforme.board.repository.BarterRepository;
import com.phofor.phocaforme.chat.dto.request.ChatMessageRequestDto;
import com.phofor.phocaforme.chat.dto.response.ChatMessageResponseDto;
import com.phofor.phocaforme.chat.entity.ChatMessage;
import com.phofor.phocaforme.chat.entity.ChatRoom;
import com.phofor.phocaforme.chat.exception.BarterBoardNotFoundException;
import com.phofor.phocaforme.chat.exception.ChatRoomNotFoundException;
import com.phofor.phocaforme.chat.repository.ChatMessageRepository;
import com.phofor.phocaforme.chat.repository.ChatRoomRepository;
import com.phofor.phocaforme.common.rabbit.producer.events.PostUpdateEvent;
import com.phofor.phocaforme.notification.service.FCMNotificationService;
import jakarta.persistence.PostUpdate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ChatMessageServiceImpl implements ChatMessageService{

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final BarterRepository barterRepository;

    // RedisService 받아오짱
    private final RedisService redisService;

    private final AmazonS3Client amazonS3Client;
    private String S3Bucket = "photocardforme";  // Bucket 이름

    private final FCMNotificationService fcmNotificationService;


    @Override
    @Transactional
    public ChatMessageResponseDto save(ChatMessageRequestDto chatMessageRequestDto, Long chatMessageRoomId, Map<String, Object> header) {
        ChatMessageResponseDto chatMessageResponseDto = new ChatMessageResponseDto(chatMessageRequestDto);
        // header? =

//        CustomOAuth2User customOAuth2User = (CustomOAuth2User) redisService.getMapData(accessToken).get("oauth2User");
//        UserEntity userEntity = customOAuth2User.getUserEntity();
//        String userId = userEntity.getUserId();
//        String userName = userEntity.getUserName();
//        log.info(userName);

        String userId = (String) header.get("userId");
        String userNickname = (String) header.get("nickname");
        log.info("여기는 서비스단의 유저아이디 : " + userId);
        log.info("여기는 서비스단의 유저닉네임 : " + userNickname);

        if (chatMessageRequestDto.getImgCode()!=null) {
            try {
                String[] strings = chatMessageRequestDto.getImgCode().split(",");   // ","를 기준으로 바이트 코드 나눠주기
                // 위에걸 try 밖으로 빼고 밖에서 리스폰스를 먼저 불르고 널 먼저 넣기
                String base64Image = strings[1];
                String extension = "";  // if문을 통해 확장자명을 정해줌
                if (strings[0].equals("data:image/jpeg;base64")){
                    extension = "jpeg";
                } else if (strings[0].equals("data:image/png;base64")){
                    extension = "png";
                } else {
                    extension = "jpg";
                }

                byte[] imageBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64Image);    // 바이트 코드를

                File tempFile = File.createTempFile("image", "." + extension);
                // createTempFile을 통해 임시 파일을 생성(임시 파일은 지워줘야함)
                try (OutputStream outputStream = new FileOutputStream(tempFile)){
                    outputStream.write(imageBytes);
                    // OutputStream outputStream = new FileOutputStream(tempFile)을 통해 생성한 outputStream 객체에 imageBytes를 작성
                }
                String originalName = "chat/" + UUID.randomUUID().toString(); // uuid를 통해 파일명이 겹치지 않게 해줌

                amazonS3Client.putObject(new PutObjectRequest(S3Bucket, originalName, tempFile).withCannedAcl(CannedAccessControlList.PublicRead));
                // s3에 tempFile 을 저장

                String awsS3ImageUrl = amazonS3Client.getUrl(S3Bucket, originalName).toString();    // s3에 저장된 이미지 불러오기

                try {
                    FileOutputStream fileOutputStream = new FileOutputStream(tempFile);
                    // 파일 삭제시 전부 아웃풋을 닫아줘야 한다(방금 생성한 임시 파일을 지워주는 과정)
                    fileOutputStream.close();   // 아웃풋 닫아주기
                    if (tempFile.delete()) {
                        log.info("File delete success");    // tempFile.delete()를 통해 삭제
                    } else {
                        log.info("File deletge fail T.T");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                //ChatMessageResponseDto chatMessageResponseDto = new ChatMessageResponseDto(chatMessageRequestDto);
                chatMessageResponseDto.setImgCode(awsS3ImageUrl);   // s3 이미지 url로 수정해준다
                //return chatMessageResponseDto;  // 밖에서 처리를 해주면 여기의 리턴이 필요 없어짐(굳이 빈 dto를 줄 필요가 없어)
            } catch (IOException ex) {
                log.error("IOException Error Message : {}", ex.getMessage());
                ex.printStackTrace();
            }
        }

        // 여기에 빌드해주기

        // 아무튼 리턴 하기 전에 여기서 빌드를 완료해줘야함
        // https://distribute.tistory.com/136 이 빌딩을 완료해줘야
        // 아니면 서비스에서 함수를 불러오고, 코드는 서비스에 짜던가
        //return new ChatMessageResponseDto();    // 그래서 위에서 싹 다 해주면 여기서 리턴 한번만 해주면 된다
        //chatMessageResponseDto.setUserEmail(userName);
        //log.info(userName);


        ChatMessage chatMessage = ChatMessage.builder()
                .chatRoomId(chatMessageRequestDto.getChatRoomId())
//                .senderId(chatMessageRequestDto.getUserEmail())
                .senderId(userId)
                .message(chatMessageRequestDto.getMessage())
                .imgCode(chatMessageResponseDto.getImgCode())   // 변경된거 쓸거기 때문에
                .build();
        ChatMessage savedChatMessage = chatMessageRepository.save(chatMessage);

        ChatRoom chatRoom = chatRoomRepository.findById(chatMessageRequestDto.getChatRoomId()).orElseThrow();
        chatRoom.setChatLatest(chatMessage);

        // 채팅 알림 보내기
        Boolean result = fcmNotificationService.sendChatMessage(chatRoom, userId).join();
        if(result){
            log.info("알림 성공");
        }
        else{
            log.info("알림 실패");
        }

        return chatMessageResponseDto;

    }

    // 채팅 내역 조회
    @Override
    public List<ChatMessageResponseDto> getAllByChatRoomId(Long chatRoomId) {
        return chatMessageRepository.findAllByChatRoomId(chatRoomId);
    }


    // 게시글 교환 완료 업데이트
    @Override
    public Boolean updateBarterStatus(Long chatRoomId) {
        try {
            ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElseThrow(ChatRoomNotFoundException::new);
            Long boardId = chatRoom.getBoardId();
            Barter barter = barterRepository.findById(boardId).orElseThrow(BarterBoardNotFoundException::new);
            barter.updateBartered(boardId, true, LocalDateTime.now());
            barterRepository.save(barter);
            publishUpdateEvent(barter,1);
        } catch (Exception e) {
            return false;
        }
        return true;
    }


    public void publishUpdateEvent(Barter barter, int type){
        ApplicationEventPublisher publisher = ApplicationEventPublisherHolder.getPublisher();
        if (publisher != null) {
            LocalDateTime localDateTime = barter.getRegistrationDate();
            ZonedDateTime zonedDateTime = localDateTime.atZone(ZoneId.systemDefault());
            Instant instant = zonedDateTime.toInstant();
            PostUpdateEvent event = new PostUpdateEvent(new BarterMessage(
                    barter.getId(),
                    barter.isBartered(),
                    type,
                    instant)
            );
            publisher.publishEvent(event);
        }
    }
//    @Override
//    public ChatMessageResponseDto chatMessageResponseDto
}
