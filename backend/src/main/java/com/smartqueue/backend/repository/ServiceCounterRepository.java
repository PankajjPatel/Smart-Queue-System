package com.smartqueue.backend.repository;

import com.smartqueue.backend.entity.ServiceCounter;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceCounterRepository extends JpaRepository<ServiceCounter, Integer> {
    List<ServiceCounter> findByLocationId(Integer locationId);
}
