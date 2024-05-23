package com.phofor.phocaforme.idol.dto.response;

import com.phofor.phocaforme.idol.entity.IdolGroup;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;


@Getter
@Builder
@AllArgsConstructor
public class IdolGroupResponseDto {

    // 들어가자마자 바로 나오는 아이돌 그룹 리스트
    private Long idolGroupId;   // 아이돌 그룹 아이디
    private String idolGroupNameEng;    // 아이돌 그룹 영어 이름
    private String idolGroupNameKr;   // 아이돌 그룹 한국어 이름
    private String idolGroupGender;  // 아이돌 그룹 성별

    public static IdolGroupResponseDto of(IdolGroup idolGroup) {
        return IdolGroupResponseDto.builder()
                .idolGroupId(idolGroup.getId())
                .idolGroupNameEng(idolGroup.getName_eng())
                .idolGroupNameKr(idolGroup.getName_kr())
                .idolGroupGender(idolGroup.getGender())
                .build();
    }
}
