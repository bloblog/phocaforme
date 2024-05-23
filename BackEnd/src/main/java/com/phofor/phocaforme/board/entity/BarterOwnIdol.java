package com.phofor.phocaforme.board.entity;

import com.phofor.phocaforme.idol.entity.IdolMember;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "barter_own_idol")
public class BarterOwnIdol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "barter_own_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idol_member_id")
    private IdolMember idolMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barter_board_id")
    private Barter barter;

    @Builder
    public BarterOwnIdol(IdolMember idolMember, Barter barter){
        this.idolMember = idolMember;
        this.barter = barter;
        barter.getOwnIdols().add(this);
    }

    public void update(IdolMember idolMember, Barter barter){
        this.idolMember = idolMember;
        this.barter = barter;
        barter.getOwnIdols().add(this);
    }
}