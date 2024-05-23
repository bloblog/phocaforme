package com.phofor.phocaforme.idol.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class IdolRankResponseDto {
    private Long id;
    private Long firstFemaleIdolId;
    private Long secondFemaleIdolId;
    private Long thirdFemaleIdolId;
    private Long firstMaleIdolId;
    private Long secondMaleIdolId;
    private Long thirdMaleIdolId;
    private LocalDateTime createdDate;
}
