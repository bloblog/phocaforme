package com.phofor.phocaforme.auth.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

/**
 * 쿠키 정보 가져오기
 */
public class CookieUtil {
    public static Cookie resolveToken(HttpServletRequest request) {
        Cookie selectedCookie = null;
        Cookie[] cookies = request.getCookies();
        if(cookies != null) {
            for(Cookie cookie : cookies) {
                if("token".equals(cookie.getName()))
                    selectedCookie = cookie;
            }
        }
        return selectedCookie;
    }

    public static Cookie resolveNickname(HttpServletRequest request) {
        Cookie selectedCookie = null;
        Cookie[] cookies = request.getCookies();
        if(cookies != null) {
            for(Cookie cookie : cookies) {
                if("nickname".equals(cookie.getName()))
                    selectedCookie = cookie;
            }
        }
        return selectedCookie;
    }

    public static Cookie resolveProfile(HttpServletRequest request) {
        Cookie selectedCookie = null;
        Cookie[] cookies = request.getCookies();
        if(cookies != null) {
            for(Cookie cookie : cookies) {
                if("profile".equals(cookie.getName()))
                    selectedCookie = cookie;
            }
        }
        return selectedCookie;
    }

    public static Cookie resolveAddress(HttpServletRequest request) {
        Cookie selectedCookie = null;
        Cookie[] cookies = request.getCookies();
        if(cookies != null) {
            for(Cookie cookie : cookies) {
                if("address".equals(cookie.getName()))
                    selectedCookie = cookie;
            }
        }
        return selectedCookie;
    }
}
