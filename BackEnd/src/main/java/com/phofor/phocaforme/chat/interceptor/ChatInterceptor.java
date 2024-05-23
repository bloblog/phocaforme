package com.phofor.phocaforme.chat.interceptor;

import com.amazonaws.services.s3.AmazonS3Client;
import com.phofor.phocaforme.auth.domain.CustomOAuth2User;
import com.phofor.phocaforme.auth.entity.UserEntity;
import com.phofor.phocaforme.auth.repository.UserRepository;
import com.phofor.phocaforme.auth.service.redis.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

import javax.swing.table.TableCellEditor;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Component
public class ChatInterceptor implements ChannelInterceptor {

    List<HashMap<String, Object>> sessions = new ArrayList<>(); // roomNumber 별로 세션 저장
    static int roomIndex = -1;
    private String S3Bucket = "photocardforme"; // Bucket 이름 aws img
    @Autowired  // aws img test
    AmazonS3Client amazonS3Client;

    private final UserRepository userRepository;

    // 파일 저장 경로
    private static final String FILE_UPLOAD_PATH = "src/main/resources/static";
    private final RedisService redisService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        StompCommand command = accessor.getCommand();

        if (StompCommand.SUBSCRIBE.equals(command)){
            log.info("ChatInterceptor");
            String[] destination = accessor.getDestination().split("/");
            log.info(destination[destination.length-1].replace("room",""));
            setValue(accessor, "chatRoomId", Long.parseLong(destination[destination.length-1].replace("room","")));
        }

        if (StompCommand.CONNECT.equals(command)) {
            // Authorization은 프론트에서 해준 것과 같게 해주면 됨(이름을)
            String authToken = accessor.getFirstNativeHeader("Authorization");
            log.info("토큰확인" + authToken);
//        String authToken = "brfgpCqAIcG8IVq0z3w5Xvtx_ykOjKJ0SSkKPXRpAAABjX4k2LpUdd9ffL_GXA";

            // authToken이 내가 프론트에서 받아온 유저의 토큰
            // 이 토큰을 사용해서 유저의 정보를 받아오기
            log.info("에바킹스" + redisService.getMapData(authToken).toString());
            CustomOAuth2User customOAuth2User = (CustomOAuth2User) (redisService.getMapData(authToken)).get("oauth2User");

            UserEntity userEntity = customOAuth2User.getUserEntity();

            // 레디스에서 유저의 정보 받아오기
//            if (StompCommand.CONNECT.equals(command)){
            setValue(accessor, "nickname", userEntity.getNickname());
            setValue(accessor, "userId", userEntity.getUserId());
//            setValue(accessor, "chatRoomId", 1L);
            log.info(userEntity.getNickname());
            log.info(userEntity.getUserName());
            log.info(userEntity.getUserId());
//            }

        }


        return message;

    }

    private void setValue(StompHeaderAccessor accessor, String key, Object value) {
        Map<String, Object> sessionAttributes = getSessionAttributes(accessor);
        sessionAttributes.put(key, value);
    }

    private Map<String, Object> getSessionAttributes(StompHeaderAccessor accessor) {
        Map<String, Object> sessionAttributes = accessor.getSessionAttributes();

        return sessionAttributes;
    }
}
