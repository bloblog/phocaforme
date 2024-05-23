package com.phofor.phocaforme.board.dto.searchDto;

import com.phofor.phocaforme.board.dto.searchDto.IdolSearchMember;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@ToString
@Builder
@Document(indexName="barter_post")
public class BarterDocument {

    // TODO: readOnly writeOnly 등으로 최적화?
    @Id
    @Field(name="article_id", type = FieldType.Keyword)
    private Long articleId;
    @Field(name = "writer_id", type = FieldType.Long)
    private String writerId;
    @Field(name = "writer_nickname", type = FieldType.Keyword)
    private String writerNickname;


    @Field(name="group_id",type=FieldType.Long)
    private Long groupId;
    @Field(name="title",type = FieldType.Text)
    private String title;
    @Field(name = "card_type", type = FieldType.Keyword)
    private String cardType;
    @Field(name = "image_url", type = FieldType.Keyword)
    private String imageUrl;
    @Field(name="content",type = FieldType.Text)
    private String content;

    @Field(name = "own_member", type = FieldType.Object)
    private List<IdolSearchMember> ownMember;
    @Field(name = "target_member", type = FieldType.Object)
    private List<IdolSearchMember> targetMember;

    @Field(name = "is_bartered", type = FieldType.Boolean)
    private boolean isBartered;

    @Field(type = FieldType.Date, format = DateFormat.date_time)
    private Instant createdAt;

    @Field(type = FieldType.Date, format = DateFormat.date_time)
    private Instant updatedAt;


}
