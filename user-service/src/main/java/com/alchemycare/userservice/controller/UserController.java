package com.alchemycare.userservice.controller;

import com.alchemycare.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/user")
public class UserController {

    @Autowired
    UserService userService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashBoard(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User user
    ) {
        return userService.getDashBoard(user.getUsername());
    }







}
