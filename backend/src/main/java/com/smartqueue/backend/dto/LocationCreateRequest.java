package com.smartqueue.backend.dto;

import lombok.Data;

@Data
public class LocationCreateRequest {
    private String name;
    private String sectorName;
}
