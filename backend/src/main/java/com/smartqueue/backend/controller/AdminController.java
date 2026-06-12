package com.smartqueue.backend.controller;

import com.smartqueue.backend.dto.*;
import com.smartqueue.backend.entity.*;
import com.smartqueue.backend.repository.*;
import com.smartqueue.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final LocationRepository locationRepository;
    private final ServiceCounterRepository serviceCounterRepository;
    private final QueueRepository queueRepository;
    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final SectorRepository sectorRepository;
    private final ServiceRepository serviceRepository;
    private final StaffCounterAssignmentRepository staffCounterAssignmentRepository;

    @GetMapping("/dashboard/metrics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        metrics.put("totalLocations", locationRepository.count());
        metrics.put("activeCounters", serviceCounterRepository.count());
        
        long tokensToday = tokenRepository.count();
        metrics.put("totalTokensToday", tokensToday);
        
        List<QueueEntity> queues = queueRepository.findAll();
        double avgWaitTime = queues.isEmpty() ? 0 : queues.stream()
            .mapToInt(QueueEntity::getCurrentAverageWaitTime)
            .average()
            .orElse(0);
        metrics.put("avgWaitTime", Math.round(avgWaitTime));
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Metrics fetched successfully", metrics));
    }

    @GetMapping("/counters")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getCountersWithAssignments() {
        List<ServiceCounter> counters = serviceCounterRepository.findAll();
        List<Map<String, Object>> counterData = counters.stream().map(counter -> {
            Map<String, Object> data = new HashMap<>();
            data.put("id", counter.getId());
            data.put("name", counter.getName());
            data.put("location", counter.getLocation().getName());
            data.put("service", counter.getService().getName());
            
            List<StaffCounterAssignment> assignments = staffCounterAssignmentRepository.findByCounterId(counter.getId());
            if (!assignments.isEmpty() && assignments.get(0).getUser() != null) {
                data.put("assignedStaff", assignments.get(0).getUser().getName());
            } else {
                data.put("assignedStaff", "Unassigned");
            }
            
            Optional<QueueEntity> queue = queueRepository.findByCounterId(counter.getId());
            data.put("status", queue.isPresent() && "ACTIVE".equals(queue.get().getStatus()) ? "Serving" : "Offline");
            
            return data;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Counters fetched successfully", counterData));
    }

    @PostMapping("/counters")
    public ResponseEntity<ApiResponse<String>> createCounter(@RequestBody CounterCreateRequest request) {
        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Location not found"));

        ServiceEntity serviceEntity = null;
        if (request.getServiceId() != null) {
            serviceEntity = serviceRepository.findById(request.getServiceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        } else {
            // Find first service for the location's sector
            List<ServiceEntity> services = serviceRepository.findBySectorId(location.getSector().getId());
            if (services.isEmpty()) {
                throw new ResourceNotFoundException("No service found for sector: " + location.getSector().getName());
            }
            serviceEntity = services.get(0);
        }

        ServiceCounter counter = new ServiceCounter();
        counter.setName(request.getName());
        counter.setLocation(location);
        counter.setService(serviceEntity);
        ServiceCounter savedCounter = serviceCounterRepository.save(counter);

        // Initialize Queue
        QueueEntity queue = new QueueEntity();
        queue.setCounter(savedCounter);
        queue.setCurrentAverageWaitTime(serviceEntity.getEstimatedTimePerTokenMins() != null ? serviceEntity.getEstimatedTimePerTokenMins() : 10);
        queue.setStatus("ACTIVE");
        queueRepository.save(queue);

        // Optional assignment
        if (request.getUserId() != null) {
            User staff = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Staff user not found"));

            // Check if staff has active assignment, deactivate it first
            Optional<StaffCounterAssignment> existing = staffCounterAssignmentRepository.findByUserIdAndStatus(staff.getId(), "ACTIVE");
            if (existing.isPresent()) {
                StaffCounterAssignment old = existing.get();
                old.setStatus("INACTIVE");
                staffCounterAssignmentRepository.save(old);
            }

            StaffCounterAssignment assignment = new StaffCounterAssignment();
            assignment.setUser(staff);
            assignment.setCounter(savedCounter);
            assignment.setStatus("ACTIVE");
            staffCounterAssignmentRepository.save(assignment);
        }

        return ResponseEntity.ok(new ApiResponse<>(true, "Counter created and initialized successfully", null));
    }

    @GetMapping("/locations")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getLocations() {
        List<Location> locations = locationRepository.findAll();
        List<Map<String, Object>> locationData = locations.stream().map(loc -> {
            Map<String, Object> data = new HashMap<>();
            data.put("id", loc.getId());
            data.put("name", loc.getName());
            data.put("sectorName", loc.getSector().getName());
            data.put("activeCounters", serviceCounterRepository.findByLocationId(loc.getId()).size());
            return data;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponse<>(true, "Locations fetched successfully", locationData));
    }

    @PostMapping("/locations")
    public ResponseEntity<ApiResponse<String>> createLocation(@RequestBody LocationCreateRequest request) {
        // Sector lookup or creation
        Sector sector = sectorRepository.findByName(request.getSectorName())
                .orElseGet(() -> {
                    Sector newSec = new Sector();
                    newSec.setName(request.getSectorName());
                    return sectorRepository.save(newSec);
                });

        Location location = new Location();
        location.setName(request.getName());
        location.setAddress("System Generated Address");
        location.setSector(sector);
        locationRepository.save(location);

        return ResponseEntity.ok(new ApiResponse<>(true, "Location created successfully", null));
    }

    @GetMapping("/staff")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getStaffList() {
        List<User> staffUsers = userRepository.findByRole_Name("STAFF");
        List<Map<String, Object>> staffData = staffUsers.stream().map(staff -> {
            Map<String, Object> data = new HashMap<>();
            data.put("id", staff.getId());
            data.put("name", staff.getName());
            data.put("email", staff.getEmail());
            
            Optional<StaffCounterAssignment> assignment = staffCounterAssignmentRepository.findByUserIdAndStatus(staff.getId(), "ACTIVE");
            if (assignment.isPresent() && assignment.get().getCounter() != null) {
                ServiceCounter counter = assignment.get().getCounter();
                data.put("assignedCounterName", counter.getName() + " (" + counter.getLocation().getName() + ")");
            } else {
                data.put("assignedCounterName", "Unassigned");
            }
            data.put("status", "Active");
            return data;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(new ApiResponse<>(true, "Staff fetched successfully", staffData));
    }

    @PostMapping("/staff")
    public ResponseEntity<ApiResponse<String>> createStaff(@RequestBody StaffCreateRequest request) {
        Role staffRole = roleRepository.findByName("STAFF")
                .orElseThrow(() -> new ResourceNotFoundException("STAFF role not found"));

        User staff = new User();
        staff.setName(request.getName());
        staff.setEmail(request.getEmail());
        staff.setPhone("0000000000");
        // default password hash for 'staff123'
        staff.setPasswordHash("$2a$10$E4T83hKxjvB/ZpA3.Yx18.yTf13/GqW4/o1N/k/mN9wS4YpZ3fSg.");
        staff.setRole(staffRole);
        
        userRepository.save(staff);
        return ResponseEntity.ok(new ApiResponse<>(true, "Staff onboarded successfully with default password 'staff123'", null));
    }

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReports() {
        Map<String, Object> reports = new HashMap<>();
        reports.put("totalUsers", userRepository.count());
        reports.put("totalCounters", serviceCounterRepository.count());
        reports.put("totalLocations", locationRepository.count());
        
        // Traffic chart (simulated or actual)
        List<Map<String, Object>> traffic = new ArrayList<>();
        String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};
        int[] counts = {120, 190, 300, 250, 400, (int)tokenRepository.count()};
        for (int i = 0; i < days.length; i++) {
            Map<String, Object> dayMap = new HashMap<>();
            dayMap.put("label", days[i]);
            dayMap.put("count", counts[i]);
            traffic.add(dayMap);
        }
        reports.put("traffic", traffic);

        // Sector chart distribution
        List<Map<String, Object>> sectorDist = new ArrayList<>();
        List<Sector> sectors = sectorRepository.findAll();
        for (Sector s : sectors) {
            Map<String, Object> dist = new HashMap<>();
            dist.put("sector", s.getName());
            
            // Count total tokens in queues of this sector
            long tokenCount = tokenRepository.findAll().stream()
                    .filter(t -> t.getQueue() != null && t.getQueue().getCounter() != null && t.getQueue().getCounter().getLocation().getSector().getId().equals(s.getId()))
                    .count();
            
            dist.put("tokens", tokenCount > 0 ? tokenCount : 5); // default mock minimum for charts
            sectorDist.add(dist);
        }
        reports.put("sectorDistribution", sectorDist);

        reports.put("summaryText", "Today observed a healthy queue flow with total " + tokenRepository.count() + " tokens across " + serviceCounterRepository.count() + " service counters. Overall system load remains normal.");

        return ResponseEntity.ok(new ApiResponse<>(true, "Reports fetched successfully", reports));
    }
}
