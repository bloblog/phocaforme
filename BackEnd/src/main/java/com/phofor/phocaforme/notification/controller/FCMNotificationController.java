package com.phofor.phocaforme.notification.controller;

import com.phofor.phocaforme.auth.domain.CustomOAuth2User;
import com.phofor.phocaforme.notification.dto.NotificationDto;
import com.phofor.phocaforme.notification.dto.message.NotificationMessageDto;
import com.phofor.phocaforme.notification.dto.message.RequestDTO;
import com.phofor.phocaforme.notification.service.FCMNotificationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class FCMNotificationController {

    private final FCMNotificationService fcmNotificationService;

    // 알림 리스트
    @GetMapping("/notification")
    public ResponseEntity<?> getMessages(@AuthenticationPrincipal CustomOAuth2User oAuth2User) {
        String userId = oAuth2User.getUserEntity().getUserId();
        List<NotificationMessageDto> notificationMessages = fcmNotificationService.getMessageList(userId);

        // 서버 오류
        if(notificationMessages == null)
            return ResponseEntity.internalServerError().build();

        log.info("알림 개수: {}", notificationMessages.size());
        log.info("첫번째 알림: {}", notificationMessages.get(0).toString());
        return new ResponseEntity<>(notificationMessages, HttpStatus.OK);
    }

    // 알림 읽기
    @PostMapping("/notification")
    public ResponseEntity<?> readMessage(@RequestBody Map<String, Long> notification) {
        HttpStatus httpStatus;

        Long notificationId = notification.get("notificationId");
        String URL = fcmNotificationService.readMessage(notificationId);
        if(!URL.isEmpty())  {
            log.info("성공");
            httpStatus = HttpStatus.OK;
        }
        else {
            log.info("실패");
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<>(URL, httpStatus);
    }

    // 알림 제거
    @DeleteMapping("/notification")
    public ResponseEntity<?> deleteMessage(@RequestBody Map<String, Long> notification) {
        HttpStatus httpStatus;

        Long notificationId = notification.get("notificationId");
        if(fcmNotificationService.deleteMessage(notificationId))  {
            log.info("성공");
            httpStatus = HttpStatus.OK;
        }
        else {
            log.info("실패");
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<>(httpStatus);
    }

    // 알림 보내기 테스트용(단일 알림)
    @PostMapping("/notification/fcm")
    public ResponseEntity<?> pushMessage(@RequestBody RequestDTO requestDTO) throws IOException {
        log.info("requestDTO : {}, {}, {}", requestDTO.getTargetToken(),requestDTO.getTitle(), requestDTO.getBody());

        fcmNotificationService.sendMessageTo(requestDTO);
        return ResponseEntity.ok().build();
    }

    // 채팅알림 등록 및 채팅알림 보내기(포스트 맨용)
    @PostMapping("/notification/post/chat")
    public ResponseEntity<?> postChatNotification(@RequestBody NotificationDto notificationDto) {
        HttpStatus httpStatus;
        log.info("chatNotificationDto : {}", notificationDto.getLink());
        log.info("ownerId:{}, visitedId:{}, userId:{}", notificationDto.getUserId(),notificationDto.getVisitedId(),notificationDto.getLink());
        if(fcmNotificationService.sendChatMessage(notificationDto)){
            log.info("성공");
            httpStatus = HttpStatus.OK;
        }
        else{
            log.info("실패");
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<>(httpStatus);
    }

    // 갈망포카 알림 등록 및 포카알림 보내기(포스트 맨용)
    @PostMapping("/notification/post/bias")
    public ResponseEntity<?> postBiasNotification(@RequestBody NotificationDto notificationDto) {
        HttpStatus httpStatus;
        List<String> ids = new ArrayList<>();
        ids.add("eb9ac477-0c41-4475-836c-0cd7438930fc");
        Long articleId = notificationDto.getArticleId();
        if(fcmNotificationService.sendBiasMessage(ids, articleId)){
            log.info("성공");
            httpStatus = HttpStatus.OK;
        }
        else{
            log.info("실패");
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<>(httpStatus);
    }
}
