package com.smartqueue.backend.controller;

import com.smartqueue.backend.dto.ApiResponse;
import com.smartqueue.backend.dto.GenerateTokenRequest;
import com.smartqueue.backend.dto.TokenResponseDto;
import com.smartqueue.backend.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tokens")
@RequiredArgsConstructor
public class TokenController {

    private final TokenService tokenService;

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<TokenResponseDto>> generateToken(
            @RequestBody GenerateTokenRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        TokenResponseDto response = tokenService.generateToken(request, email);
        return ResponseEntity.ok(new ApiResponse<>(true, "Token generated successfully", response));
    }
}
