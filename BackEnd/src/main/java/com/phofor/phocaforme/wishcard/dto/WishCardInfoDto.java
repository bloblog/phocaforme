package com.phofor.phocaforme.wishcard.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class WishCardInfoDto {

    Long memberId;
    String keyword1;
    String keyword2;
    String keyword3;
}
