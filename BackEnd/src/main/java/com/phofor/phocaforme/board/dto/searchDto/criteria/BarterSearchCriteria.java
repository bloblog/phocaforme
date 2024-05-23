package com.phofor.phocaforme.board.dto.searchDto.criteria;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
@Getter
@Setter
@ToString
public class BarterSearchCriteria {
    public static final int SIZE_MIN = 1;
    public static final int SIZE_MAX = 30;
    private Integer page = 1;
    private Integer size = 10;
    private Long groupId;
    private String query;
    private List<Long> target;
    private List<Long> own;
    private String cardType;

}
