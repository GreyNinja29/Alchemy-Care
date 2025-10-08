package com.alchemycare.userservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name ="medicines")

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder


public class MedicineModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long medicineId;

    private String medicineName;
    private String dosage;
    private String description;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    private FrequencyType frequencyType;
    private Integer frequencyInterval;

    private LocalDateTime nextDose;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;




    @ManyToOne()
    @JoinColumn(name = "fk_user_id")
    private UserModel user;
}
