package com.smartqueue.backend.controller;

import com.smartqueue.backend.dto.ApiResponse;
import com.smartqueue.backend.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/staff")
@PreAuthorize("hasRole('STAFF')")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @GetMapping("/counter")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAssignedCounter(Authentication authentication) {
        String email = authentication.getName();
        Map<String, Object> data = staffService.getStaffDashboardData(email);
        return ResponseEntity.ok(new ApiResponse<>(true, "Fetched counter details successfully", data));
    }

    @PostMapping("/tokens/next")
    public ResponseEntity<ApiResponse<Map<String, Object>>> nextToken(Authentication authentication) {
        String email = authentication.getName();
        Map<String, Object> nextToken = staffService.callNextToken(email);
        return ResponseEntity.ok(new ApiResponse<>(true, "Next token called successfully", nextToken));
    }

    @PostMapping("/tokens/{tokenId}/skip")
    public ResponseEntity<ApiResponse<Void>> skipToken(@PathVariable Integer tokenId, Authentication authentication) {
        String email = authentication.getName();
        staffService.skipToken(tokenId, email);
        return ResponseEntity.ok(new ApiResponse<>(true, "Token skipped successfully", null));
    }

    @PostMapping("/tokens/{tokenId}/complete")
    public ResponseEntity<ApiResponse<Void>> completeToken(@PathVariable Integer tokenId, Authentication authentication) {
        String email = authentication.getName();
        staffService.completeToken(tokenId, email);
        return ResponseEntity.ok(new ApiResponse<>(true, "Token completed successfully", null));
    }
}
