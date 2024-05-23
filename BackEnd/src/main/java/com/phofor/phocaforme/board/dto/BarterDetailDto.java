package com.phofor.phocaforme.board.dto;

import com.phofor.phocaforme.board.entity.Barter;
import com.phofor.phocaforme.board.entity.BarterFindIdol;
import com.phofor.phocaforme.board.entity.BarterImage;
import com.phofor.phocaforme.board.entity.BarterOwnIdol;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static com.phofor.phocaforme.board.config.ElasticsearchClientConfig.toInstantFormat;

@Builder
@Getter
@ToString
@AllArgsConstructor
public class BarterDetailDto {
    // 게시글 id
    private Long id;
    // 게시글 작성자 id
    private String userId;
    // 게시글 작성자 닉네임
    private String nickName;
    // 앨범명
    private String title;
    // 내용
    private String content;
    // 아이돌 그룹 id
    private Long groupId;
    // 소유한 멤버(들)
    private List<IdolMemberDto> ownIdolMembers;
    // 찾는 멤버(들)
    private List<IdolMemberDto> findIdolMembers;
    // 포토카드 사진(들)
    private List<String> photos;
    // 카드 종류
    private String cardType;

    private boolean isBartered;

    // 생성 일자
    private Instant registrationDate;

    private Instant modifiedDate;
    // Entity -> Dto 바꿔주는 메소드
    public static BarterDetailDto of(Barter barter) {
        Instant registInstant = toInstantFormat(barter.getRegistrationDate());
        Instant modifyInstant = toInstantFormat(barter.getLastModifiedDate());
        return BarterDetailDto.builder()
                .id(barter.getId())
                .userId(barter.getUser().getUserId())
                .nickName(barter.getUser().getNickname())
                .title(barter.getTitle())
                .content(barter.getContent())
                .groupId(barter.getGroupId())
                .ownIdolMembers(barter.getOwnIdols().stream()
                        .map(ownIdol -> new IdolMemberDto(ownIdol.getIdolMember().getId(), ownIdol.getIdolMember().getName()))
                        .collect(Collectors.toList()))
                .findIdolMembers(barter.getFindIdols().stream()
                        .map(findIdol -> new IdolMemberDto(findIdol.getIdolMember().getId(), findIdol.getIdolMember().getName()))
                        .collect(Collectors.toList()))
                .photos(barter.getImages().stream().map(BarterImage::getImgCode).collect(Collectors.toList()))
                .cardType(barter.getCardType())
                .isBartered(barter.isBartered())
                .registrationDate(registInstant)
                .modifiedDate(modifyInstant)
                .build();
    }

    public BarterDetailDto(Long id){
        this.id=id;
    }

}