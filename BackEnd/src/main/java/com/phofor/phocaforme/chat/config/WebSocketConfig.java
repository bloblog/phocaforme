package com.phofor.phocaforme.chat.config;

import com.phofor.phocaforme.auth.domain.CustomOAuth2User;
import com.phofor.phocaforme.auth.entity.UserEntity;
import com.phofor.phocaforme.auth.service.redis.RedisService;
import com.phofor.phocaforme.chat.interceptor.ChatInterceptor;
import com.phofor.phocaforme.chat.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;

import java.util.Map;

@Slf4j
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private  final ChatInterceptor chatInterceptor;
    private final RedisService redisService;
    private final ChatRoomService chatRoomService;

    private String current = "blank";
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config){
        config.enableSimpleBroker("/sub");  // sub으로 들어오는 요청을 처리해주기 위해
        config.setApplicationDestinationPrefixes("/pub");   // pub으로 들어오는 요청을 처리해주기 위해
    }

    @Bean
    public ServletServerContainerFactoryBean createWebSocketContainer() {
        ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();

        container.setMaxTextMessageBufferSize(50*1024*1024);
        container.setMaxBinaryMessageBufferSize(50*1024*1024);
        container.setMaxSessionIdleTimeout(15*60000L);

        return container;
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry){
        registry.addEndpoint("/ws-stomp").setAllowedOriginPatterns("*").withSockJS();
//        registry.addEndpoint("/ws-stomp").setAllowedOriginPatterns("*");
        // Endpoint 지정, setAllowedOriginPatterns("*")를 통해 요청 url 전부 허용
        // + withSockJs() 함수를 통해 ws, wss로 socket을 연결하는 것이 아닌 http, https로 socket을 연결하도롥 바꾸어줌
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration){
        registration.setMessageSizeLimit(50*1024*1024); // 메시지 크기 제한 오류 방지
        registration.setSendBufferSizeLimit(50*1024*1024);
        // (해당 코드가 없으면 byte code 보낼 때 소켓 연결이 끊길 수 있음)
    }



    @EventListener
    public void connectEvent(SessionConnectEvent sessionConnectEvent) {
        current = "now I'm here";
        System.out.println(sessionConnectEvent);
        System.out.println("연결 성공 감지 !-!-!-!");
        System.out.println(current);
        // return "redirect:chat/message";
    }

    @EventListener
    public void onDisconnectEvent(SessionDisconnectEvent sessionDisconnectEvent) {

        Message<byte[]> message = sessionDisconnectEvent.getMessage();
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        StompCommand command = accessor.getCommand();

        if (StompCommand.DISCONNECT.equals(command)){

            Long chatRoomId = (Long) ((Map<String, Object>)message.getHeaders().get("simpSessionAttributes")).get("chatRoomId");
            String userId = (String) ((Map<String, Object>)message.getHeaders().get("simpSessionAttributes")).get("userId");
            log.info("chatRoomId : " + chatRoomId);

            chatRoomService.updateLatestChat(userId, chatRoomId);

        }

        System.out.println(sessionDisconnectEvent);
        System.out.println(current);
        System.out.println("연결 끊어짐 감지 !-!-!-!");

    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(chatInterceptor);
    }
}








