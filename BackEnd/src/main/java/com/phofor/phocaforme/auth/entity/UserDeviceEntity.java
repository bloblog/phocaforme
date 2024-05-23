package com.phofor.phocaforme.auth.entity;

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
@Table(name="user_device")
public class UserDeviceEntity {

    @Id
    @Column(name = "user_device_user_id", columnDefinition = "CHAR(50)", nullable = false)
    private String userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_device_user_id")
    private UserEntity userEntity;

    @Column(name = "user_device_token", columnDefinition = "VARCHAR(255)", unique = true)
    private String deviceToken;

    @CreationTimestamp
    @Column(name = "user_device_created_at", nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "user_device_updated_at")
    private LocalDateTime updDatedAt;
}
