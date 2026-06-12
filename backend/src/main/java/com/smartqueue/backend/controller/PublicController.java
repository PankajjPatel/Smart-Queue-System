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
    private final com.smartqueue.backend.service.TokenService tokenService;

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

    @GetMapping("/queue/info")
    public ResponseEntity<com.smartqueue.backend.dto.ApiResponse<com.smartqueue.backend.dto.QueueInfoResponseDto>> getQueueInfo(
            @RequestParam Integer locationId,
            @RequestParam Integer serviceId) {
        com.smartqueue.backend.dto.QueueInfoResponseDto response = tokenService.getQueueInfo(locationId, serviceId);
        return ResponseEntity.ok(new com.smartqueue.backend.dto.ApiResponse<>(true, "Queue info retrieved successfully", response));
    }
}
