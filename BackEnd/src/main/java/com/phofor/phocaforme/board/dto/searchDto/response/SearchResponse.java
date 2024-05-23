package com.phofor.phocaforme.board.dto.searchDto.response;

import com.phofor.phocaforme.board.dto.searchDto.IdolSearchMember;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;
@Getter
@Setter
@AllArgsConstructor
public class SearchResponse implements Serializable {
    // 게시물 목록 양식에 들어갈 데이터만 제공
    // articleId는 MariaDB에 찾으러 갈 때 필요
    private Long id;
    private String imageUrl;
    private String title;
//    private String group;
    private List<IdolSearchMember> ownMember;
    private List<IdolSearchMember> targetMember;
//    private String cardType;
//    private String createdAt; // 게시물 생성 일자
    private String writerId;
    private boolean isBartered;

    private Double distance;
}
