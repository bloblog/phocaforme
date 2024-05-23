package com.phofor.phocaforme.idol.dto.response;

import com.phofor.phocaforme.idol.entity.IdolMember;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class IdolMemberResponseDto {

    private Long idolMemberId;  // 멤버의 아이디
    private Long idolGroupId;   // 아이돌 그룹 아이디
    private String idolName;    // 멤버 이름
    private String idolImage;   // 멤버 이미지
    private Long idolSearchCount;   // 멤버 조회 횟수
    private Long idolSearchCountTemp; // 멤버 조회 횟수 임시값

    public static IdolMemberResponseDto of(IdolMember idolMember) {
        return IdolMemberResponseDto.builder()
                .idolMemberId(idolMember.getId())
                // IdolGroup으로 저장되어 있기 때문에 (ManyToOne) 한번 들렀다가 갔다와줘
                .idolGroupId(idolMember.getIdolGroup().getId())
                .idolName(idolMember.getName())
                .idolImage(idolMember.getImage())
                .idolSearchCount(idolMember.getSearchCount())
                .idolSearchCountTemp(idolMember.getSearchCountTemp())
                .build();
    }
}
