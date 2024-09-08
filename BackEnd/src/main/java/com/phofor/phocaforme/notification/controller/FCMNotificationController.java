package com.phofor.phocaforme.notification.controller;

import com.phofor.phocaforme.auth.domain.CustomOAuth2User;
import com.phofor.phocaforme.notification.dto.NotificationDto;
import com.phofor.phocaforme.notification.dto.message.NotificationMessageDto;
import com.phofor.phocaforme.notification.dto.message.RequestDTO;
import com.phofor.phocaforme.notification.service.FCMNotificationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
@Slf4j
public class FCMNotificationController {

    private final FCMNotificationService fcmNotificationService;

    //    @Qualifier("asyncTaskExecutor")
//    private final ThreadPoolTaskExecutor asyncTaskExecutor;  // asyncTaskExecutor로 주입
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

    // 채팅알림 등록 및 채팅알림 보내기(포스트 맨용) - 배치 없는 버전
    @PostMapping("/notification/post/chat")
    public ResponseEntity<?> postChatNotification(@RequestBody NotificationDto notificationDto) {
        HttpStatus httpStatus;
        log.info("chatNotificationDto : {}", notificationDto.getLink());
        log.info("ownerId:{}, visitedId:{}, userId:{}", notificationDto.getUserId(), notificationDto.getVisitedId(), notificationDto.getLink());

        List<CompletableFuture<Boolean>> futureList = new ArrayList<>();
        for (int i = 0; i < 300; i++) {
            int attempt = i;  // i 값을 새로운 지역 변수로 복사

            // 각 메시지에 대해 비동기적으로 실행
            CompletableFuture<Boolean> future = CompletableFuture.supplyAsync(() -> {
                log.info("Sending message attempt: {}", attempt + 1);
                boolean result = fcmNotificationService.sendChatMessage(notificationDto).join();  // 메시지 전송
                log.info("Message sent - Thread: {}", Thread.currentThread().getName());  // 전송 후 스레드 정보 출력
                return result;
                // 기다리는 작업
//                log.info("Sending message attempt: {}", attempt + 1);
//                boolean result = fcmNotificationService.sendChatMessage(notificationDto).join();
//                try {
//                    log.info("Message sent, now waiting 30 seconds - Thread: {}", Thread.currentThread().getName());
//                    TimeUnit.SECONDS.sleep(30);  // 30초 대기
//                } catch (InterruptedException e) {
//                    log.error("Interrupted while waiting: ", e);
//                    Thread.currentThread().interrupt();
//                }
//                return result;
            });

            futureList.add(future);

            // 100개의 알림을 보낸 후 1초 대기
            if ((i + 1) % 100 == 0) {
                try {
                    log.info("100 notifications sent, waiting for 1 second...");
                    Thread.sleep(1000);  // 1초 대기
                } catch (InterruptedException e) {
                    log.error("Sleep interrupted", e);
                    Thread.currentThread().interrupt();
                }
            }
        }

// 모든 비동기 작업의 결과를 기다린 후 성공 여부 확인
        CompletableFuture.allOf(futureList.toArray(new CompletableFuture[0])).join();

// 각 메시지의 처리 결과 확인
        boolean allSuccess = futureList.stream()
                .map(CompletableFuture::join)
                .allMatch(result -> result);

//        boolean allSuccess = true;
//        for (int i = 0; i < 30; i++) {
//            int attempt = i;  // i 값을 새로운 지역 변수로 복사
//
//            log.info("Sending message attempt: {}", attempt + 1);
//
//            // 메시지 동기적으로 전송
//            boolean result = fcmNotificationService.sendChatMessage(notificationDto).join();
//
//            if (!result) {
//                allSuccess = false;  // 하나라도 실패하면 성공 플래그를 false로 설정
//            }
//        }
        if (allSuccess) {
            log.info("모든 메시지 전송 성공");
            httpStatus = HttpStatus.OK;
        } else {
            log.info("일부 메시지 전송 실패");
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
        Boolean result = fcmNotificationService.sendBiasMessage(ids, articleId).join();
        if(result){
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