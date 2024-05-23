package com.phofor.phocaforme.wishcard.entity;

import com.phofor.phocaforme.auth.entity.UserEntity;
import com.phofor.phocaforme.idol.entity.IdolMember;
import com.phofor.phocaforme.wishcard.service.WishCardEntityListener;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EntityListeners({WishCardEntityListener.class})
@Table(name="user_wish_card")
public class WishCard {

    @Id
    @Column(name = "user_wish_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY) // or another strategy based on your DB
    private Long wishCardId;

    @OneToOne
    @JoinColumn(name = "user_wish_user_id", columnDefinition = "CHAR(50)", nullable = false)
    private UserEntity userEntity;

    @OneToOne
    @JoinColumn(name = "user_wish_idol_member_id", columnDefinition = "BIGINT(20)", nullable = false)
    private IdolMember idolMember;

    @Column(name="user_wish_keyword1", columnDefinition = "VARCHAR(50)", unique = true)
    private String keyword1;

    @Column(name="user_wish_keyword2", columnDefinition = "VARCHAR(50)", unique = true)
    private String keyword2;

    @Column(name="user_wish_keyword3", columnDefinition = "VARCHAR(50)", unique = true)
    private String keyword3;

    @CreationTimestamp
    @Column(name = "user_wish_created_at", nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "user_wish_updated_at")
    private LocalDateTime updatedAt;

    public int numberOfKeyword(){
        int number = 0;
        if(this.keyword1!=null){
            number++;
        }
        if(this.keyword2!=null){
            number++;
        }
        if(this.keyword3!=null){
            number++;
        }
        return number;
    }
}