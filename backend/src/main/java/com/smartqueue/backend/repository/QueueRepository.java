package com.smartqueue.backend.repository;

import com.smartqueue.backend.entity.QueueEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface QueueRepository extends JpaRepository<QueueEntity, Integer> {
    Optional<QueueEntity> findByCounterId(Integer counterId);
    List<QueueEntity> findAllByCounterId(Integer counterId);
}
