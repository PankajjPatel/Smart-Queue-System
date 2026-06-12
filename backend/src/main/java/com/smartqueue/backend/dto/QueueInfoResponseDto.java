package com.smartqueue.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QueueInfoResponseDto {
    private long personsAhead;
    private int estimatedWaitTimeMinutes;
    private String activeCounterName;
}
