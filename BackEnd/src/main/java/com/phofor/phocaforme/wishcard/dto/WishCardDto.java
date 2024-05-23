package com.phofor.phocaforme.wishcard.dto;

import com.phofor.phocaforme.wishcard.entity.WishCard;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class WishCardDto {

    private String userId;

    private Long idolMemberId;

    private String keyword1;

    private String keyword2;

    private String keyword3;


    public static WishCardDto of(WishCard wishCard) {
//        Instant registInstant = toInstantFormat(wishCard.getCreatedAt());
//        Instant modifyInstant = toInstantFormat(wishCard.getUpdatedAt());
        return WishCardDto.builder()
                .userId(wishCard.getUserEntity().getUserId())
                .idolMemberId(wishCard.getIdolMember().getId())
                .keyword1(wishCard.getKeyword1())
                .keyword2(wishCard.getKeyword2())
                .keyword3(wishCard.getKeyword3())
                .build();
    }

    public WishCardDto(String userId){
        this.userId = userId;
    }
}
