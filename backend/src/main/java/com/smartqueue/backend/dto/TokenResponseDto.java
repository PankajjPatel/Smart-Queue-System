package com.smartqueue.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TokenResponseDto {
    private Integer tokenId;
    private Integer tokenNumber;
    private String status;
    private String queueLocation;
    private String serviceName;
    private LocalDateTime expectedServiceTime;
    private long personsAhead;
    private int estimatedWaitTimeMinutes;
}
