package com.alchemycare.userservice.dto;


import com.alchemycare.userservice.model.FrequencyType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Builder
@Data
public class MedicineResponseDTO {
    private Long medicineId;
    private String medicineName;
    private String dosage;
    private String description;
    private LocalDateTime nextDoseTime;
    private LocalDateTime endTime;
    private FrequencyType frequencyType;
    private Integer frequencyInterval;

}
