package com.phofor.phocaforme.board.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.phofor.phocaforme.auth.entity.UserEntity;
import com.phofor.phocaforme.board.dto.searchDto.IdolSearchMember;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Getter
@EntityListeners({AuditingEntityListener.class})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "barter")
public class Barter {

    // 교환게시글 ID
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "barter_board_id")
    private Long id;

    // 작성자 ID
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    // 앨범명
    @Column(name = "barter_title")
    private String title;

    // 내용
    @Column(name = "barter_content")
    private String content;

    // 카드타입
    @Column(name = "barter_card_type")
    private String cardType;

    @Column(name = "barter_group_id")
    private Long groupId;

    // 찾는 멤버(들)
    @JsonIgnore
    @OneToMany(mappedBy = "barter")
    @Column(name = "barter_find_idols")
    private List<BarterFindIdol> findIdols = new ArrayList<>();

    // 소유한 멤버(들)
    @JsonIgnore
    @OneToMany(mappedBy = "barter")
    @Column(name = "barter_own_idols")
    private List<BarterOwnIdol> ownIdols = new ArrayList<>();

    // 이미지(들)
    @JsonIgnore
    @OneToMany(mappedBy = "barter")
    @Column(name = "barter_images")
    private List<BarterImage> images = new ArrayList<>();

    // 교환유무
    @Column(columnDefinition = "boolean default false")
    private boolean bartered;
    
    // 교환게시글 상태(삭제유무)
    @Column(name = "barter_status", columnDefinition = "boolean default false")
    private boolean barterStatus;

    @CreatedDate
    @Column(name = "created_date", updatable = false)
    private LocalDateTime registrationDate;

    @LastModifiedDate
    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;

    @Builder
    public Barter(UserEntity userEntity, String title, String content, String cardType, Long groupId) {
        this.user = userEntity;
        this.title = title;
        this.content = content;
        this.cardType = cardType;
        this.groupId = groupId;
    }

    public void update(UserEntity userEntity, String title, String content, String cardType, Long groupId, LocalDateTime lastModifiedDate){
        this.user = userEntity;
        this.title = title;
        this.content = content;
        this.cardType = cardType;
        this.groupId = groupId;
        this.lastModifiedDate = lastModifiedDate;
        //userEntity.getBarters().add(this);
    }


    public void updateBartered(Long boardId, Boolean bartered, LocalDateTime lastModifiedDate){
        this.id = boardId;
        this.bartered = bartered;
        this.lastModifiedDate = lastModifiedDate;
    }
}