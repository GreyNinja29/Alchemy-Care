package com.alchemycare.userservice.service;


import com.alchemycare.userservice.dto.DashBoardResponseDTO;
import com.alchemycare.userservice.dto.MedicineResponseDTO;
import com.alchemycare.userservice.model.MedicineModel;
import com.alchemycare.userservice.model.UserModel;
import com.alchemycare.userservice.repository.MedicineRepo;
import com.alchemycare.userservice.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@Service
public class UserService {

    @Autowired
    UserRepo userRepo;
    @Autowired
    MedicineRepo medicineRepo;


    public ResponseEntity<?> getDashBoard(String userEmail) {
        UserModel user=userRepo.findUserModelByEmail(userEmail);

        if(user==null) {

            return new ResponseEntity<>("User does not exist", HttpStatus.BAD_REQUEST);
        }

        List<MedicineModel> allMedicines=user.getMedicine();

        long totalMedicines=allMedicines.size();

        long completedMedicines=allMedicines.stream()
                .filter(m-> m.getEndTime().isBefore(LocalDateTime.now()))
                .count();

        long activeMedicines=totalMedicines-completedMedicines;

        LocalDateTime nextDoseTime=allMedicines.stream()
                .map(MedicineModel::getNextDose)
                .filter(Objects::nonNull)
                .filter(t -> t.isAfter(LocalDateTime.now()))
                .sorted()
                .findFirst().orElse(null);


        List<MedicineResponseDTO> upcomingMedicines=allMedicines.stream()
                .filter(m-> m.getNextDose()!=null && m.getNextDose().isAfter(LocalDateTime.now()))
                .sorted(Comparator.comparing(MedicineModel::getNextDose))
                .limit(5)
                .map(this::makeMedResponse)
                .toList();

        DashBoardResponseDTO dashboard=DashBoardResponseDTO.builder()
                .userName(user.getUserName())
                .userEmail(user.getEmail())
                .totalMedicines(totalMedicines)
                .activeMedicines(activeMedicines)
                .completedMedicines(completedMedicines)
                .nextDoseTime(nextDoseTime)
                .upcomingMedicines(upcomingMedicines)
                .build();

        return new ResponseEntity<>(dashboard,HttpStatus.OK);



    }


    private  MedicineResponseDTO makeMedResponse(MedicineModel saved) {

        MedicineResponseDTO resp=MedicineResponseDTO.builder()
                .medicineId(saved.getMedicineId())
                .medicineName(saved.getMedicineName())
                .dosage(saved.getDosage())
                .description(saved.getDescription())
                .frequencyType(saved.getFrequencyType())
                .frequencyInterval(saved.getFrequencyInterval())
                .nextDoseTime(saved.getNextDose())
                .endTime(saved.getEndTime())
                .build();

        return resp;

    }
}
