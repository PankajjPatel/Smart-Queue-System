package com.smartqueue.backend.dto;

import lombok.Data;

@Data
public class StaffCreateRequest {
    private String name;
    private String email;
    private Integer locationId;
}
