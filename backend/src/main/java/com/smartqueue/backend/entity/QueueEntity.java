package com.smartqueue.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "queue")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QueueEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "queue_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "counter_id", nullable = false)
    private ServiceCounter counter;

    @Column(name = "current_average_wait_time")
    private Integer currentAverageWaitTime = 5;

    private String status = "ACTIVE";
}
