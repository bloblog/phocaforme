package com.phofor.phocaforme.board.dto.searchDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class IdolSearchMember {
    @Field(type = FieldType.Keyword)
    private Long member_id;
    @Field(type = FieldType.Keyword)
    private String member_name;

}
