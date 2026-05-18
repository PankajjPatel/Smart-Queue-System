package com.smartqueue.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "staff_counter_assignment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StaffCounterAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assignment_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "counter_id", nullable = false)
    private ServiceCounter counter;

    private String status = "ACTIVE";

    @Column(name = "assigned_at", insertable = false, updatable = false)
    private LocalDateTime assignedAt;
}
