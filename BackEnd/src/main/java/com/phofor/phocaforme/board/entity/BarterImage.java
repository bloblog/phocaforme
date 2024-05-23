package com.phofor.phocaforme.board.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "barter_image")
public class BarterImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "barter_image_id")
    private Long id;

    @Column(name = "barter_img_code")
    private String imgCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barter_board_id")
    private Barter barter;

    @Builder
    public BarterImage(String imgCode, Barter barter){
        this.imgCode = imgCode;
        this.barter = barter;
        barter.getImages().add(this);
    }

    public void update(String imgCode, Barter barter){
        this.imgCode = imgCode;
        this.barter = barter;
        barter.getImages().add(this);
    }
}