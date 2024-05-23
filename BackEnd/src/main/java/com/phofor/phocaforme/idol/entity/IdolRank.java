package com.phofor.phocaforme.idol.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "idol_rank")
public class IdolRank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idol_rank_id")
    private Long id;

    @Column(name = "first_female_idol_id")
    private Long firstFemaleIdolId;
    @Column(name = "second_female_idol_id")
    private Long secondFemaleIdolId;
    @Column(name = "third_female_idol_id")
    private Long thirdFemaleIdolId;

    @Column(name = "first_male_idol_id")
    private Long firstMaleIdolId;
    @Column(name = "second_male_idol_id")
    private Long secondMaleIdolId;
    @Column(name = "third_male_idol_id")
    private Long thirdMaleIdolId;

    @CreatedDate
    @Column(name = "created_date")
    private LocalDateTime createdDate;
    @Builder
    public IdolRank(Long id, Long firstFemaleIdolId, Long secondFemaleIdolId, Long thirdFemaleIdolId,
                    Long firstMaleIdolId, Long secondMaleIdolId, Long thirdMaleIdolId, LocalDateTime createdDate) {
        this.id = id;
        this.firstFemaleIdolId = firstFemaleIdolId;
        this.secondFemaleIdolId = secondFemaleIdolId;
        this.thirdFemaleIdolId = thirdFemaleIdolId;
        this.firstMaleIdolId = firstMaleIdolId;
        this.secondMaleIdolId = secondMaleIdolId;
        this.thirdMaleIdolId = thirdMaleIdolId;
        this.createdDate = createdDate;
    }
}
