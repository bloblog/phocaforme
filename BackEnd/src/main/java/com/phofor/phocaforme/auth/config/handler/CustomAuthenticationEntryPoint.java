package com.phofor.phocaforme.auth.config.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * 에러 헨들러
 * 로그인이 되어 있는 상태가 아닐때 보안으로 연결된 페이지로 가면 이 페이지로 넘어감
 * 여기서는 로그인 페이지로 가게 만듬
 */

@Slf4j
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private ObjectMapper objectMapper = new ObjectMapper();
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        // 여기에 인증 실패 시 실행할 로직을 작성
        // 예: response.sendRedirect("/login"); 또는 에러 메시지 전송
//        log.error("error ----- {}",authException.getMessage());
        log.error("Authentication error: {}", authException.getMessage());

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Map<String, Object> data = new HashMap<>();
        data.put("timestamp", new Date());
        data.put("status", HttpServletResponse.SC_UNAUTHORIZED);
        data.put("error", "Unauthorized");
        data.put("message", authException.getMessage());
        data.put("path", request.getRequestURI());

        response.getOutputStream()
                .println(objectMapper.writeValueAsString(data));
    }
}
