package com.phofor.phocaforme.board.entity;

import com.phofor.phocaforme.idol.entity.IdolMember;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
@Table(name = "barter_find_idol")
public class BarterFindIdol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "barter_find_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idol_member_id")
    private IdolMember idolMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barter_board_id")
    private Barter barter;

    @Builder
    public BarterFindIdol(IdolMember idolMember, Barter barter){
        this.idolMember = idolMember;
        this.barter = barter;
        barter.getFindIdols().add(this);
    }

    public void update(IdolMember idolMember, Barter barter){
        this.idolMember = idolMember;
        this.barter = barter;
        barter.getFindIdols().add(this);
    }
}