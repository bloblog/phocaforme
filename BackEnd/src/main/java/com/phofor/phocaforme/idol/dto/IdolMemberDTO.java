package com.phofor.phocaforme.idol.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class IdolMemberDTO {

    private Long idolMemberId;
    private String idolName;
    private Long searchCount;
}
