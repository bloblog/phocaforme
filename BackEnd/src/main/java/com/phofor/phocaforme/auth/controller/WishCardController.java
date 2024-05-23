package com.phofor.phocaforme.auth.controller;

import com.phofor.phocaforme.auth.domain.CustomOAuth2User;
import com.phofor.phocaforme.auth.entity.UserEntity;
import com.phofor.phocaforme.wishcard.dto.WishCardInfoDto;
import com.phofor.phocaforme.wishcard.dto.response.WishCardResponseDto;
import com.phofor.phocaforme.wishcard.service.WishCardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Controller
@RequiredArgsConstructor
public class WishCardController {

    private final WishCardService wishCardSelectService;

    // 갈망포카 등록
    @PutMapping("/user/wishCard")
    public ResponseEntity<?> registWishCard(@RequestBody WishCardInfoDto wishCardInfoDto,
                                            @AuthenticationPrincipal CustomOAuth2User oauth2User
                                            ) {
        log.info("Member Id : {}", wishCardInfoDto.getMemberId());
        log.info("Keyword : {}/{}/{}", wishCardInfoDto.getKeyword1(), wishCardInfoDto.getKeyword2(), wishCardInfoDto.getKeyword3());

        HttpStatus status;
        UserEntity userEntity = oauth2User.getUserEntity();
        if(wishCardSelectService.registWishCardByUserId(userEntity.getUserId(), wishCardInfoDto)) {
            status = HttpStatus.ACCEPTED;
        }
        else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<>(status);
    }

    // 최애 불러오기
    @GetMapping("/user/wishCard")
    public ResponseEntity<?> getWishCard(@AuthenticationPrincipal CustomOAuth2User oauth2User) {
        String userId = oauth2User.getUserEntity().getUserId();
        HttpStatus status;
        WishCardResponseDto idolMemberResponseDto = wishCardSelectService.loadWishCardByUserId(userId);
        if(idolMemberResponseDto != null) {
            status = HttpStatus.ACCEPTED;
            return new ResponseEntity<>(idolMemberResponseDto, status);
        }
        else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            return new ResponseEntity<>(status);
        }
    }

    // 갈망포카 제거
    @DeleteMapping("/user/wishCard")
    public ResponseEntity<?> deleteWishCard(@AuthenticationPrincipal CustomOAuth2User oauth2User) {
        HttpStatus status;
        UserEntity userEntity = oauth2User.getUserEntity();
        if(wishCardSelectService.deleteWishCardByUserId(userEntity.getUserId())) {
            status = HttpStatus.ACCEPTED;
        }
        else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<>(status);
    }
}
