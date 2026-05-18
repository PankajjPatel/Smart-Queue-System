package com.smartqueue.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Please enter your full name")
    private String name;

    @NotBlank(message = "Please enter a valid email address")
    @Email(message = "Please enter a valid email address")
    private String email;

    @NotBlank(message = "Phone number must be exactly 10 digits")
    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be exactly 10 digits")
    private String phone;

    @NotBlank(message = "Password must contain at least 6 characters")
    @Size(min = 6, message = "Password must contain at least 6 characters")
    private String password;

    private String role; // e.g., CUSTOMER
}
