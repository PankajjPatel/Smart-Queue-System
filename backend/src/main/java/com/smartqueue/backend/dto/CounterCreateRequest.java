package com.smartqueue.backend.dto;

import lombok.Data;

@Data
public class CounterCreateRequest {
    private String name;
    private Integer locationId;
    private Integer userId;
    private Integer serviceId;
}
