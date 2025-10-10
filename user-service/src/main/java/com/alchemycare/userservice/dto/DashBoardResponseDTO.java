package com.alchemycare.userservice.dto;


import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class DashBoardResponseDTO {
    private String userName;
    private String userEmail;
    private long totalMedicines;
    private long activeMedicines;
    private long completedMedicines;
    private LocalDateTime nextDoseTime;
    private List<MedicineResponseDTO> upcomingMedicines;
}
