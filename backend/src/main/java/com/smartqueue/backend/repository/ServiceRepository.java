package com.smartqueue.backend.repository;

import com.smartqueue.backend.entity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceRepository extends JpaRepository<ServiceEntity, Integer> {
    List<ServiceEntity> findBySectorId(Integer sectorId);
}
