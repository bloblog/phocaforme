package com.phofor.phocaforme.gps.controller;


import com.phofor.phocaforme.auth.domain.CustomOAuth2User;
import com.phofor.phocaforme.auth.entity.UserEntity;
import com.phofor.phocaforme.auth.service.redis.RedisService;
import com.phofor.phocaforme.auth.util.CookieUtil;
import com.phofor.phocaforme.gps.dto.GpsLocationDto;
import com.phofor.phocaforme.gps.service.GpsService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@Slf4j
@RequiredArgsConstructor
public class GpsController {

    private final GpsService gpsService;
    private final RedisService redisService;

    // GPS 위치 정보 키기, 갱신
    @PutMapping("/gps")
    public ResponseEntity<?> turnOnAddress (@RequestBody GpsLocationDto gpsLocationDto,
                                          @AuthenticationPrincipal CustomOAuth2User oauth2User,
                                          HttpServletRequest request,
                                          HttpServletResponse response){
        log.info("longitude - {}", gpsLocationDto.getLongitude());
        log.info("latitude - {}", gpsLocationDto.getLatitude());

        String address;
        HttpStatus status;
        int time = (60 * 60 * 3) + (60 * 60 * 9);

        // gps 주소 받아오기
        try {
            address = gpsService.getAddress(gpsLocationDto);
            status = HttpStatus.ACCEPTED;
            // gps 주소 레디스에 저장
            UserEntity userEntity = oauth2User.getUserEntity();
            if(gpsService.saveGpsData(userEntity.getUserId(), gpsLocationDto)) {
                Cookie userIdCookie = CookieUtil.resolveAddress(request);
                // 신규
                if(userIdCookie == null) {
                    // 주소를 쿠키에 저장
                    String encodedValue = URLEncoder.encode(address, StandardCharsets.UTF_8);
                    Cookie addressCookie = new Cookie("address", encodedValue);
                    addressCookie.setPath("/");
                    // 필요하다면 쿠키의 도메인 설정
                    addressCookie.setMaxAge(time); // 쿠키 유효 시간 설정
                    response.addCookie(addressCookie); // 쿠키를 응답에 추가
                }
                // 갱신
                else {
                    // 기존 쿠키 지우기
                    userIdCookie.setMaxAge(0);

                    // 갱신
                    String encodedValue = URLEncoder.encode(address, StandardCharsets.UTF_8);
                    Cookie addressCookie = new Cookie("address", encodedValue);
                    addressCookie.setPath("/");
                    // 필요하다면 쿠키의 도메인 설정
                    addressCookie.setMaxAge(time); // 쿠키 유효 시간 설정
                    response.addCookie(addressCookie); // 쿠키를 응답에 추가
                }
            }
            else {
                log.info("레디스 저장 오류 입니다.");
            }
        } catch (Exception e) {
            address = "잘못된 주소 정보 입니다.";
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<>(address, status);
    }

    // GPS 위치 정보 끄기
    @GetMapping("/gps")
    public ResponseEntity<?> turnOffAddress(
                                          @AuthenticationPrincipal CustomOAuth2User oauth2User,
                                          HttpServletRequest request,
                                          HttpServletResponse response){
        HttpStatus status;
        // redis에 있는 gps data 삭제
        UserEntity userEntity = oauth2User.getUserEntity();
        redisService.deleteGpsData(userEntity.getUserId());

        // 쿠키 데이터 삭제
        Cookie selectedCookie = CookieUtil.resolveAddress(request);
        if(selectedCookie != null) {
            status = HttpStatus.ACCEPTED;
            selectedCookie.setPath("/");
            selectedCookie.setMaxAge(0);
            response.addCookie(selectedCookie);
        }
        else{
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            log.info("쿠키 데이터 없음");
        }
        return new ResponseEntity<>(status);
    }

}