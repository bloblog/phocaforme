//package com.phofor.phocaforme.notification.dto;
//
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Getter;
//
//import java.util.Map;
//
//@Builder
//@Getter
//@AllArgsConstructor
//public class FcmMessage {
//    private boolean validateOnly;
//    private Message message;
//
//    @Builder
//    @AllArgsConstructor
//    @Getter
//    public static class Message {
//        private Notification notification;
//        private String token;
//        private Map<String, String> data; // 'data' 필드 추가
//    }
//
//    @Builder
//    @AllArgsConstructor
//    @Getter
//    public static class Notification {
//        private String title;
//        private String body;
//        private String image;
//    }
//}

package com.phofor.phocaforme.notification.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Builder
@Getter
@AllArgsConstructor
public class FCMNotificationMessage {
    private boolean validateOnly;
    private Message message;

    @Builder
    @AllArgsConstructor
    @Getter
    public static class Message {
        private String token;
        private Map<String, String> data;
    }
}