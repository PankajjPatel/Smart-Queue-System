package com.smartqueue.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sector")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Sector {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sector_id")
    private Integer id;

    @Column(name = "sector_name", nullable = false, unique = true)
    private String name;
}
