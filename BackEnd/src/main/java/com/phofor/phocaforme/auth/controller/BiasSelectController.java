package com.phofor.phocaforme.auth.controller;

import com.phofor.phocaforme.auth.domain.CustomOAuth2User;
import com.phofor.phocaforme.auth.service.user.UserService;
import com.phofor.phocaforme.auth.util.CookieUtil;
import com.phofor.phocaforme.idol.dto.response.IdolMemberResponseDto;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;


@Slf4j
@RequiredArgsConstructor
@Controller
public class BiasSelectController {

    private final UserService userService;

    // 최애 등록
    @PutMapping("/user/bias")
    public ResponseEntity<?> updateBias(@RequestBody Map<String, Long> biasIdol,
                                        HttpServletRequest request, HttpServletResponse response,
                                        @AuthenticationPrincipal CustomOAuth2User oauth2User) {

        Long idolMemberId = biasIdol.get("idolMemberId");
        String userId = oauth2User.getUserEntity().getUserId();
        HttpStatus status;
        Cookie tokenCookie = CookieUtil.resolveToken(request);
        Cookie profileCookie = CookieUtil.resolveProfile(request);

        String profileURL = userService.updateBias(userId, idolMemberId, tokenCookie.getValue());
        if (!profileURL.isEmpty()){
            int time = (60*60*24*14) + (60*60*9); //14일 유지
            if(profileCookie != null) {
                // 기존 쿠키 지우기
                profileCookie.setMaxAge(0);
            }

            // 갱신
            log.info("쿠키 :{}", profileCookie);
            String encodedValue = URLEncoder.encode(profileURL, StandardCharsets.UTF_8);
            Cookie newProfileCookie = new Cookie("profile", encodedValue);
            newProfileCookie.setPath("/");
            // 필요하다면 쿠키의 도메인 설정
            newProfileCookie.setMaxAge(time); // 쿠키 유효 시간 설정
            response.addCookie(newProfileCookie); // 쿠키를 응답에 추가
            status = HttpStatus.ACCEPTED;
            log.info("쿠키 시간:{}", newProfileCookie.getMaxAge());
            log.info("쿠키 값:{}", newProfileCookie.getValue());
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<>(profileURL, status);
    }

    // 최애 불러오기
    @GetMapping("/user/bias")
    public ResponseEntity<?> getBias(@AuthenticationPrincipal CustomOAuth2User oauth2User) {
        String userId = oauth2User.getUserEntity().getUserId();
        HttpStatus status;
        IdolMemberResponseDto idolMemberResponseDto = userService.loadBias(userId);
        if(idolMemberResponseDto != null) {
            status = HttpStatus.ACCEPTED;
            return new ResponseEntity<>(idolMemberResponseDto, status);
        }
        else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            return new ResponseEntity<>(status);
        }
    }
}
