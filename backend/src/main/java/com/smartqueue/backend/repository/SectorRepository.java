package com.smartqueue.backend.repository;

import com.smartqueue.backend.entity.Sector;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SectorRepository extends JpaRepository<Sector, Integer> {
}
