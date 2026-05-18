package com.smartqueue.backend.repository;

import com.smartqueue.backend.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Integer> {
    List<Location> findBySectorId(Integer sectorId);
}
