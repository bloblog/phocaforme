package com.phofor.phocaforme.idol.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "idol_member")
public class IdolMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idol_member_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idol_group_id")
    private IdolGroup idolGroup;

    @Column(name = "idol_name")
    private String name;

    private String image;

    @Column(name = "search_count")
    private Long searchCount;

    @Column(name = "search_count_temp")
    private Long searchCountTemp;

    @Builder
    public IdolMember(Long id, IdolGroup idolGroup, String name, String image, Long searchCount, Long searchCountTemp) {
        this.id = id;
        this.idolGroup = idolGroup;
        this.name = name;
        this.image = image;
        this.searchCount = searchCount;
        this.searchCountTemp = searchCountTemp;
    }

    public void updateTempCount(Long count){
        this.searchCountTemp = count;
    }

    public void updateTotalCount(Long count){
        this.searchCount = this.searchCount+count;
    }
}
