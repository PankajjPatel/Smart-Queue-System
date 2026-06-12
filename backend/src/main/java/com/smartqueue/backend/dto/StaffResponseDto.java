package com.smartqueue.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffResponseDto {
    private Integer id;
    private String name;
    private String email;
    private String assignedCounterName;
    private String status;
}
