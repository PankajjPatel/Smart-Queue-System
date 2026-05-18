package com.smartqueue.backend.controller;

import com.smartqueue.backend.entity.Location;
import com.smartqueue.backend.entity.Sector;
import com.smartqueue.backend.entity.ServiceEntity;
import com.smartqueue.backend.repository.LocationRepository;
import com.smartqueue.backend.repository.SectorRepository;
import com.smartqueue.backend.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final SectorRepository sectorRepository;
    private final LocationRepository locationRepository;
    private final ServiceRepository serviceRepository;

    @GetMapping("/sectors")
    public ResponseEntity<List<Sector>> getSectors() {
        return ResponseEntity.ok(sectorRepository.findAll());
    }

    @GetMapping("/locations")
    public ResponseEntity<List<Location>> getLocations(@RequestParam Integer sectorId) {
        return ResponseEntity.ok(locationRepository.findBySectorId(sectorId));
    }

    @GetMapping("/services")
    public ResponseEntity<List<ServiceEntity>> getServices(@RequestParam Integer sectorId) {
        return ResponseEntity.ok(serviceRepository.findBySectorId(sectorId));
    }
}
