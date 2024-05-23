package com.phofor.phocaforme.auth.entity;

import com.phofor.phocaforme.board.entity.Barter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Spring Data Jpa 사용하여 UserEntity 생성
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="user")
public class UserEntity implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "user_id", columnDefinition = "CHAR(50)", nullable = false)
    private String userId;

    @Column(name = "user_name", columnDefinition = "CHAR(20)", nullable = false)
    private String userName;

    @Column(name="user_kakao_id", columnDefinition = "VARCHAR(50)", unique = true)
    private String kakaoId;

    @Column(name="user_email", columnDefinition="VARCHAR(100)", unique = true)
    private String email;

    @Column(name="user_nickname", columnDefinition = "VARCHAR(50)", unique = true)
    private String nickname;

    @Column(name="user_bias_id", columnDefinition = "BIGINT")
    private Long biasId;

    @CreationTimestamp
    @Column(name="user_created_at", nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "user_updated_at")
    private LocalDateTime updDatedAt;

    @Column(name="user_oauth_type", columnDefinition="VARCHAR(50)")
    private String oauthType;

//    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
//    private List<Barter> barters = new ArrayList<>();
}