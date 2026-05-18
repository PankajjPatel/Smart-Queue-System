package com.smartqueue.backend.repository;

import com.smartqueue.backend.entity.StaffCounterAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StaffCounterAssignmentRepository extends JpaRepository<StaffCounterAssignment, Integer> {
    Optional<StaffCounterAssignment> findByUserIdAndStatus(Integer userId, String status);
    List<StaffCounterAssignment> findByCounterId(Integer counterId);
}
