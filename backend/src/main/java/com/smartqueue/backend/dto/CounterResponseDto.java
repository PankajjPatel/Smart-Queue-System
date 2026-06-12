package com.smartqueue.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CounterResponseDto {
    private Integer id;
    private String name;
    private String locationName;
    private String serviceName;
    private String assignedStaffName;
    private String status;
}
