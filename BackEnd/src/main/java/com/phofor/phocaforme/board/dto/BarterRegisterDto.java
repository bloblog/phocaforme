package com.phofor.phocaforme.board.dto;

import lombok.Data;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

// 교환게시판 글 작성폼
@Data
@ToString
public class BarterRegisterDto {
    // 앨범이름 
    private String title;
    // 내용
    private String content;
    // 그룹 아이디
    private Long groupId;
    // 소유한 멤버(들)
    private List<Long> ownIdolMembers;
    // 찾는 멤버(들)
    private List<Long> findIdolMembers;
    // 포토카드 사진(들)
    private List<MultipartFile> photos;
    // 카드 종류
    private String cardType;
}