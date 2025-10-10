package com.alchemycare.userservice.controller;


import com.alchemycare.userservice.dto.MedicineRequestDTO;
import com.alchemycare.userservice.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/medicines")
public class MedicineController {

    @Autowired
    MedicineService medicineService;

    @PostMapping()
    public ResponseEntity<?> addMedicine(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User user,
            @RequestBody MedicineRequestDTO medicineRequestDTO) {

       return medicineService.addMedicine(user.getUsername(),medicineRequestDTO);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedicine(@PathVariable Long id,
                                            @AuthenticationPrincipal org.springframework.security.core.userdetails.User user) {

        return medicineService.deleteMedicine(user.getUsername(),id);
    }


    @GetMapping("/all")
    public ResponseEntity<?> getAllMedicine(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User user
    ) {

        return medicineService.getAllMedicine(user.getUsername());
    }





}
