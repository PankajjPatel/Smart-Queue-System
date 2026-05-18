package com.smartqueue.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "service_counter")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceCounter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "counter_id")
    private Integer id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceEntity service;
}
