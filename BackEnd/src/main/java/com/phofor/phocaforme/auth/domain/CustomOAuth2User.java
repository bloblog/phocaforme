package com.phofor.phocaforme.auth.domain;

import com.phofor.phocaforme.auth.entity.UserEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.io.Serial;
import java.io.Serializable;
import java.util.Collection;
import java.util.Map;

/**
 * DB에서 불러온 UserEntity, OAuth2User 정보 커스텀 마이징
 * OAuth2User 객체가 Redis에 저장될 것이며, 개인 프로필 사진 링크(S3)도 저장될 예정
 * Controller에서는 이 객체를 통해 사용자 정보를 받아와 DTO를 생성해 사용
 */

public class CustomOAuth2User implements OAuth2User, Serializable {

    @Serial
    private static final long serialVersionUID = 1L; // serialVersionUID
    private final OAuth2User oauth2User;
    private UserEntity userEntity;
    private String profilePhotoUrl;

    public CustomOAuth2User(OAuth2User oauth2User, UserEntity userEntity) {
        this.oauth2User = oauth2User;
        this.userEntity = userEntity;
    }

    public CustomOAuth2User(OAuth2User oauth2User, UserEntity userEntity, String profilePhotoUrl) {
        this.oauth2User = oauth2User;
        this.userEntity = userEntity;
        this.profilePhotoUrl = profilePhotoUrl;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return oauth2User.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return oauth2User.getAuthorities();
    }

    @Override
    public String getName() {
        return oauth2User.getName();
    }

    public UserEntity getUserEntity() {
        return userEntity;
    }

    public String getProfilePhotoUrl() { return profilePhotoUrl;}

    public void setUserEntity(UserEntity userEntity) {
        this.userEntity = userEntity;
    }

    public void setProfilePhotoUrl(String profilePhotoUrl) {
        this.profilePhotoUrl = profilePhotoUrl;
    }
}
