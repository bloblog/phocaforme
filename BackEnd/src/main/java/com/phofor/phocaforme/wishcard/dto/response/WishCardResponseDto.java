package com.phofor.phocaforme.wishcard.dto.response;

import com.phofor.phocaforme.idol.dto.response.IdolMemberResponseDto;
import com.phofor.phocaforme.wishcard.entity.WishCard;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class WishCardResponseDto {

    private String userId;
    private String keyword1;
    private String keyword2;
    private String keyword3;
    private IdolMemberResponseDto idolMemberResponseDto;


    public static WishCardResponseDto of(WishCard wishCard, IdolMemberResponseDto idolMemberResponseDto) {
        return WishCardResponseDto.builder()
                .userId(wishCard.getUserEntity().getUserId())
                .keyword1(wishCard.getKeyword1())
                .keyword2(wishCard.getKeyword2())
                .keyword3(wishCard.getKeyword3())
                .idolMemberResponseDto(idolMemberResponseDto)
                .build();
    }
}
