package com.phofor.phocaforme.wishcard.dto;

import lombok.*;

import java.io.Serializable;
import java.time.Instant;

@Getter
@Setter
@Builder
@ToString
@AllArgsConstructor
public class WishMessage implements Serializable {

    private static final long serialVersionUId = 1L;
    private String userId;
    private Instant createdAt;
    private Integer type;
    private Integer keywordNumber;
}
