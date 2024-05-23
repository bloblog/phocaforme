package com.phofor.phocaforme.board.dto.searchDto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.phofor.phocaforme.common.rabbit.producer.CustomInstantDeserializer;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
//@AllArgsConstructor
//@RequiredArgsConstructor
//@NoArgsConstructor
public class SearchCountMessage {

    private Long id;
    @JsonDeserialize(using = CustomInstantDeserializer.class)
    private Instant createdAt;

    @JsonCreator
    public SearchCountMessage(@JsonProperty("id") Long id,
                              @JsonProperty("createdAt") Instant createdAt) {
        this.id = id;
        this.createdAt = createdAt;
    }
}
