package com.phofor.phocaforme.board.dto;

import com.phofor.phocaforme.board.entity.Barter;
import com.phofor.phocaforme.board.entity.BarterFindIdol;
import com.phofor.phocaforme.board.entity.BarterImage;
import com.phofor.phocaforme.board.entity.BarterOwnIdol;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class BarterThumbnailDto {
    // 앨범이름
    private String title;
    // 소유한 멤버(들)
    private List<Long> ownIdolMembers;
    // 찾는 멤버(들)
    private List<Long> findIdolMembers;
    // 포토카드 사진(들)
    private List<String> photos;
    // 카드 종류
    private String cardType;

    public static BarterThumbnailDto of(Barter barter) {
        return BarterThumbnailDto.builder()
                .title(barter.getTitle()) // TradeResponseDto의 title 필드를 Trade entity의 title 값으로 설정
                .findIdolMembers(barter
                        .getFindIdols()
                        .stream()
                        .map(BarterFindIdol::getId)
                        .collect(Collectors.toList()))
                .ownIdolMembers(barter
                        .getOwnIdols()
                        .stream()
                        .map(BarterOwnIdol::getId)
                        .collect(Collectors.toList()))
                .photos(barter
                        .getImages()
                        .stream()
                        .map(BarterImage::getImgCode)
                        .collect(Collectors.toList()))
                .cardType(barter.getCardType())
                .build();
    }
}
