package com.phofor.phocaforme.idol.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table(name = "idol_group")
public class IdolGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idol_group_id")
    private Long id;

    @Column(name = "idol_group_name_kr")
    private String name_kr;

    @Column(name = "idol_group_name_eng")
    private String name_eng;

    private String gender;

    @OneToMany(mappedBy = "idolGroup")
    private List<IdolMember> members = new ArrayList<>();
}