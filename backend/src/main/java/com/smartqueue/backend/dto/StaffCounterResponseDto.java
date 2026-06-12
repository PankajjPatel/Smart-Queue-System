package com.smartqueue.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffCounterResponseDto {
    private Integer counterId;
    private String counterName;
    private String locationName;
    private String serviceName;
}
