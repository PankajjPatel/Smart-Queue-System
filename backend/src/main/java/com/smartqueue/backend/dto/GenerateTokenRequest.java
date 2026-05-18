package com.smartqueue.backend.dto;

import lombok.Data;

@Data
public class GenerateTokenRequest {
    private Integer locationId;
    private Integer serviceId;
}
