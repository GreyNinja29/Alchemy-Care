package com.alchemycare.userservice.controller;


import com.alchemycare.userservice.dto.MedicineRequestDTO;
import com.alchemycare.userservice.service.CustomUserDetailService;
import com.alchemycare.userservice.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    @Autowired
    MedicineService medicineService;

    public ResponseEntity<?> addMedicine(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User user,
            @RequestBody MedicineRequestDTO medicineRequestDTO) {

       return medicineService.addMedicine(user.getUsername(),medicineRequestDTO);



    }





}
