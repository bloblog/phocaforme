package com.phofor.phocaforme.board.controller;

import com.phofor.phocaforme.auth.domain.CustomOAuth2User;
import com.phofor.phocaforme.auth.entity.UserEntity;
import com.phofor.phocaforme.board.dto.BarterDetailDto;
import com.phofor.phocaforme.board.dto.BarterRegisterDto;
import com.phofor.phocaforme.board.dto.BarterUpdateDto;
import com.phofor.phocaforme.board.dto.IdolMemberDto;
import com.phofor.phocaforme.board.dto.searchDto.request.SearchRequest;
import com.phofor.phocaforme.board.dto.searchDto.response.SearchResponse;
import com.phofor.phocaforme.board.entity.Barter;
import com.phofor.phocaforme.board.service.BarterSearchService;
import com.phofor.phocaforme.board.service.BarterService;
import com.phofor.phocaforme.notification.service.FCMNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/barter")
@RequiredArgsConstructor
public class BarterController {
    private final BarterSearchService barterSearchService;
    private final BarterService barterService;
    private final FCMNotificationService fcmNotificationService;

    @GetMapping
    public ResponseEntity<List<SearchResponse>> searchAll()
    {
        List<SearchResponse> results = barterSearchService.searchAll();
        return ResponseEntity.ok(results);
    }

    @GetMapping("/search")
    public ResponseEntity<List<SearchResponse>> search(@Validated @ModelAttribute SearchRequest searchRequest)
    {
        List<SearchResponse> results = barterSearchService.search(searchRequest);
        System.out.println(results);
        return ResponseEntity.ok(results);
    }


    // 끌어올리기 기능
    @PostMapping("/regen/{barterId}")
    public ResponseEntity<?> regenBarter(@PathVariable Long barterId) throws IOException {
        Long id = barterService.regen(barterId);
        return new ResponseEntity<Long>(id, HttpStatus.OK);
    }

    // 상세게시글 나타내기
    @GetMapping("/{barterId}")
    public ResponseEntity<?> detailBarter(@PathVariable Long barterId) throws IOException {
        return new ResponseEntity<BarterDetailDto>(barterService.findOne(barterId), HttpStatus.OK);
    }

    // 게시글 등록
    @PostMapping
    public ResponseEntity<?> registerBarter(BarterRegisterDto registerDto, @AuthenticationPrincipal CustomOAuth2User oauth2User) throws IOException {
        System.out.println(registerDto.getContent());
        registerDto.setContent(URLDecoder.decode(registerDto.getContent(), StandardCharsets.UTF_8));
//        System.out.println(registerDto.getContent());
        UserEntity userEntity = oauth2User.getUserEntity();

        Barter barter = barterService.registerBarter(registerDto, userEntity);
        List<IdolMemberDto> idols = barter.getOwnIdols().stream().map(
                ownIdol -> new IdolMemberDto(
                        ownIdol.getIdolMember().getId(), ownIdol.getIdolMember().getName()
                )).toList();
        List<String> ids = new ArrayList<>();
        ids.addAll(barterSearchService.wishPhoca3(barter.getTitle(),idols,3));
        ids.addAll(barterSearchService.wishPhoca2(barter.getTitle(),idols,2));
        ids.addAll(barterSearchService.wishPhoca1(barter.getTitle(),idols,1));

        fcmNotificationService.sendBiasMessage(ids,barter.getId());
        return new ResponseEntity<Barter>(barter, HttpStatus.OK);
    }

    // 게시글 수정
    @PutMapping("/{barterId}")
    public ResponseEntity<?> updateBarter(@PathVariable Long barterId, BarterUpdateDto updateDto, @AuthenticationPrincipal CustomOAuth2User oauth2User) throws IOException {
        barterService.update(oauth2User.getUserEntity(), barterId, updateDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 게시글 삭제
    @DeleteMapping("/{barterId}")
    public ResponseEntity<?> deleteBarter(@PathVariable Long barterId) throws IOException {
        barterService.delete(barterId);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}