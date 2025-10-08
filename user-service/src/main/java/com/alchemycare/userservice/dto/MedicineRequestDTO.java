package com.alchemycare.userservice.dto;

import com.alchemycare.userservice.model.FrequencyType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MedicineRequestDTO {

    private String medicineName;
    private String dosage;
    private String description;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private FrequencyType frequencyType;
    private Integer frequencyInterval;

}

