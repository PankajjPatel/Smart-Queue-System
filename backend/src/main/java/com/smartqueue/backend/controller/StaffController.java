package com.smartqueue.backend.controller;

import com.smartqueue.backend.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff")
@PreAuthorize("hasRole('STAFF')")
@RequiredArgsConstructor
public class StaffController {

    @GetMapping("/counter")
    public ResponseEntity<ApiResponse<String>> getAssignedCounter() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Fetched counter", "Counter 1"));
    }

    @PostMapping("/tokens/next")
    public ResponseEntity<ApiResponse<String>> nextToken() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Next token called", "Token #12"));
    }

    @PostMapping("/tokens/{tokenId}/skip")
    public ResponseEntity<ApiResponse<String>> skipToken(@PathVariable Integer tokenId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Token skipped", null));
    }

    @PostMapping("/tokens/{tokenId}/complete")
    public ResponseEntity<ApiResponse<String>> completeToken(@PathVariable Integer tokenId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Token completed", null));
    }
}
