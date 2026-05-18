package com.smartqueue.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "token")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "token_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "queue_id", nullable = false)
    private QueueEntity queue;

    @Column(name = "token_number", nullable = false)
    private Integer tokenNumber;

    @Column(name = "issue_time", insertable = false, updatable = false)
    private LocalDateTime issueTime;

    @Column(name = "expected_service_time")
    private LocalDateTime expectedServiceTime;

    private String status = "PENDING";
}
