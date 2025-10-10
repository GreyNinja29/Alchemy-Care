package com.alchemycare.userservice.controller;

import com.alchemycare.userservice.dto.LoginDTO;
import com.alchemycare.userservice.dto.SignupDTO;
import com.alchemycare.userservice.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Validated  @RequestBody LoginDTO loginDTO) {
            return authService.login(loginDTO);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@Validated @RequestBody SignupDTO signupDTO) {
        return authService. signup(signupDTO);
    }



}
