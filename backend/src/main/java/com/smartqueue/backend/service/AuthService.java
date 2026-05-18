package com.smartqueue.backend.service;

import com.smartqueue.backend.dto.AuthRequest;
import com.smartqueue.backend.dto.AuthResponse;
import com.smartqueue.backend.dto.RegisterRequest;
import com.smartqueue.backend.entity.Role;
import com.smartqueue.backend.entity.User;
import com.smartqueue.backend.exception.ResourceNotFoundException;
import com.smartqueue.backend.repository.RoleRepository;
import com.smartqueue.backend.repository.UserRepository;
import com.smartqueue.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().getName());
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getRole().getName());
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        Role role = roleRepository.findByName(request.getRole() != null ? request.getRole() : "CUSTOMER")
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser.getEmail(), role.getName());
        return new AuthResponse(token, savedUser.getEmail(), savedUser.getName(), role.getName());
    }
}
