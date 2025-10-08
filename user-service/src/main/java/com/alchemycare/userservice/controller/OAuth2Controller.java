package com.alchemycare.userservice.controller;


import com.alchemycare.userservice.service.OAuth2Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/oauth2")
public class OAuth2Controller {

    @Autowired
    OAuth2Service oAuth2Service;

    @GetMapping("/authorize/google")
    public ResponseEntity<?> redirectToGoogle() {
        String googleAuthUrl= oAuth2Service.buildGoogleAuthUrl();

        return new ResponseEntity<>(googleAuthUrl, HttpStatus.OK);
    }

    @GetMapping("/callback/google")
    public ResponseEntity<?> handleGoogleCallBack(@RequestParam("code") String code ) {

        return oAuth2Service.handleGoogleCallBack(code);

    }
}
