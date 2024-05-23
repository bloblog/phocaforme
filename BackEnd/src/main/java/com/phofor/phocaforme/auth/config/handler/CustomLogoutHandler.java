package com.phofor.phocaforme.auth.config.handler;

import com.phofor.phocaforme.auth.domain.CustomOAuth2User;
import com.phofor.phocaforme.auth.entity.UserEntity;
import com.phofor.phocaforme.auth.service.redis.RedisService;
import com.phofor.phocaforme.auth.service.user.UserService;
import com.phofor.phocaforme.auth.util.CookieUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.logout.LogoutHandler;

import java.util.Map;

/**
 * LogOutHandler 구현
 * 기존의 Handler를 커스텀하여 로그아웃 시 쿠키에 있는 Access Token을 찾아와
 * Redis에 저장된 정보(Key : Access Token, Value : Map<String, Object> UserData)를 제거
 * 쿠키 제거 후 로그아웃 로직 실행
 */

@Slf4j
@RequiredArgsConstructor
public class CustomLogoutHandler implements LogoutHandler {

    // 레디스 서비스
    private final RedisService redisService;
    private final UserService userService;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        // 쿠키에 저장된 access token 가져오기
        Cookie tokenCookie = CookieUtil.resolveToken(request);
        String accessToken = null;
        if(tokenCookie != null)
            accessToken = tokenCookie.getValue();
        log.debug("[CustomLogoutHandler] - Access Token : {}", accessToken);

        // 로그아웃이 2번에 걸쳐서 진행됨
        if (accessToken != null) {
            log.info("[CustomLogoutHandler] - 1차 로그아웃");

            // db에 있는 deviceToken 지우기
            // 로그아웃 필터가 유저 인증 필터 보다 앞에 있기 때문에 회원 정보는 레디스에 얻어와야 한다.
            Map<String, Object> userData = redisService.getMapData(accessToken);
            CustomOAuth2User customOAuth2User = (CustomOAuth2User) userData.get("oauth2User");
            log.info("유저 아이디: {}", customOAuth2User.getUserEntity().getUserId());
            if(userService.deleteDeviceToken(customOAuth2User.getUserEntity().getUserId())) {
                log.info("디바이스 토큰 제거 성공");
            }
            else{
                log.info("디바이스 토큰 제거 실패");
            }
            // 레디스에 저장된 회원 데이터 지우기
            redisService.deleteMapData(accessToken);

            // 쿠키에 저장된 access token 지우기
            Cookie[] cookies = request.getCookies();
            if(cookies != null) {
                for(int i = cookies.length-1; i>=0; i--){
                    Cookie curr = cookies[i];
                    curr.setPath("/");
                    curr.setMaxAge(0);
                    response.addCookie(curr);
                }
            }
        }
        else{
            log.debug("[CustomLogoutHandler] - 2차 로그아웃");
        }
    }

}
