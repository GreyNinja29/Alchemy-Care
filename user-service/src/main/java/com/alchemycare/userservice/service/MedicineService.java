package com.alchemycare.userservice.service;


import com.alchemycare.userservice.dto.MedicineRequestDTO;
import com.alchemycare.userservice.dto.MedicineResponseDTO;
import com.alchemycare.userservice.events.EventType;
import com.alchemycare.userservice.events.MedicineEvent;
import com.alchemycare.userservice.model.MedicineModel;
import com.alchemycare.userservice.model.UserModel;
import com.alchemycare.userservice.repository.MedicineRepo;
import com.alchemycare.userservice.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@Service
public class MedicineService {
    @Autowired
    UserRepo userRepo;

    @Autowired
    MedicineRepo medicineRepo;

    @Autowired
    KafkaTemplate<String, MedicineEvent> kafkaTemplate;

    @Value("${kafka.topic.medicine-events}")
    public String medicineTopic;


    public ResponseEntity<?> addMedicine(String userEmail, MedicineRequestDTO medicineRequestDTO) {

        //SAVING THE MEDICINE IN DB PART
        UserModel user=userRepo.findUserModelByEmail(userEmail);

        if(user==null) {
            return new ResponseEntity<>("User does not exist", HttpStatus.BAD_REQUEST);
        }


        MedicineModel medicine=MedicineModel.builder()
                .medicineName(medicineRequestDTO.getMedicineName())
                .dosage(medicineRequestDTO.getDosage())
                .description(medicineRequestDTO.getDescription())
                .startTime(medicineRequestDTO.getStartTime())
                .endTime(medicineRequestDTO.getEndTime())
                .frequencyType(medicineRequestDTO.getFrequencyType())
                .frequencyInterval(medicineRequestDTO.getFrequencyInterval())
                .nextDose(medicineRequestDTO.getStartTime())
                .user(user)
                .build();

        MedicineModel saved=medicineRepo.save(medicine);

        // KAFKA INTEGRATION PART

        MedicineEvent event=MedicineEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .userId(user.getUserId())
                .userEmail(user.getEmail())
                .medicineId(saved.getMedicineId())
                .medicineName(saved.getMedicineName())
                .nextDose(saved.getNextDose())
                .frequencyType(saved.getFrequencyType().toString())
                .frequencyInterval(saved.getFrequencyInterval())
                .eventType(EventType.SCHEDULED.toString())
                .message("Time to Take "+saved.getMedicineName())
                .build();


      CompletableFuture.runAsync(() -> {
          try {
              kafkaTemplate.send(medicineTopic,event).get(5, TimeUnit.MILLISECONDS);
              System.out.println("Message sent successfully");
          }
          catch (Exception ex) {
              System.out.println("Message failed to send :" + ex.getMessage());
          }
      });

//        kafkaTemplate.send(medicineTopic,event);





        //RETURNING THE RESPONSE PART

        MedicineResponseDTO resp=makeMedResponse(saved);

        return new ResponseEntity<>(resp,HttpStatus.OK);

    }



    public ResponseEntity<?> deleteMedicine(String userEmail, Long medId) {

        UserModel user=userRepo.findUserModelByEmail(userEmail);

        MedicineModel medicine=medicineRepo.findById(medId)
                .filter(m -> m.getUser().getUserId().equals(user.getUserId()))
                .orElseThrow(() -> new RuntimeException("Medicine Not Found"));

        medicineRepo.delete(medicine);

        //SENDING THE MESSAGE TO KAFKA

        MedicineEvent event=MedicineEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .userId(user.getUserId())
                .medicineId(medicine.getMedicineId())
                .medicineName(medicine.getMedicineName())
                .eventType(EventType.CANCELLED.toString())
                .message("Canceled Medicine Remainder")
                .build();


        CompletableFuture.runAsync(() -> {
            try {
                kafkaTemplate.send(medicineTopic,event).get(5, TimeUnit.MILLISECONDS);
                System.out.println("Message sent successfully");
            }
            catch (Exception ex) {
                System.out.println("Message failed to send :" + ex.getMessage());
            }
        });

//        kafkaTemplate.send(medicineTopic,event);

        // RETURNING RESPONSE

        return new ResponseEntity<>("Medicine Deleted",HttpStatus.OK);

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
