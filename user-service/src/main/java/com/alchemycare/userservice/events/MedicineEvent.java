package com.alchemycare.userservice.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MedicineEvent {

    private String eventId;
    private Long userId;
    private String userEmail;
    private Long medicineId;
    private String medicineName;
    private String message;
    private LocalDateTime nextDose;
    private String frequencyType;
    private Integer frequencyInterval;
    private String eventType;


}
