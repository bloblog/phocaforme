package com.phofor.phocaforme.wishcard.dto;


import com.phofor.phocaforme.wishcard.entity.WishCard;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Document(indexName = "wish_phoca_2")
public class WishDocument2 {

//    @Id
//    @Field(name="wish_card_id")
//    private Long wishCardId;
    @Id
    @Field(name="user_id",type= FieldType.Keyword)
    private String userId;

    @Field(name="idol_member_id",type = FieldType.Long)
    private Long idolMemberId;

    @Field(name="keyword1",type = FieldType.Text)
    private String keyword1;

    @Field(name="keyword2",type = FieldType.Text)
    private String keyword2;



    public static WishDocument2 of(WishCard wishCard) {
//        Instant registInstant = toInstantFormat(wishCard.getCreatedAt());
//        Instant modifyInstant = toInstantFormat(wishCard.getUpdatedAt());
        return WishDocument2.builder()
                .userId(wishCard.getUserEntity().getUserId())
                .idolMemberId(wishCard.getIdolMember().getId())
                .keyword1(wishCard.getKeyword1())
                .keyword2(wishCard.getKeyword2())
                .build();
    }

    public WishDocument2(String userId){
        this.userId = userId;
    }
}
