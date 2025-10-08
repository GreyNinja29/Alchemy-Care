package com.alchemycare.userservice.service;


import com.alchemycare.userservice.dto.ResponseDTO;
import com.alchemycare.userservice.jwt.JwtService;
import com.alchemycare.userservice.model.UserModel;
import com.alchemycare.userservice.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.security.SecureRandom;
import java.util.Map;

@Service
public class OAuth2Service {

    @Autowired
    UserRepo userRepo;

    @Autowired
    JwtService jwtService;


    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String redirectUri;


    private final RestTemplate restTemplate=new RestTemplate();





    public String buildGoogleAuthUrl() {

        return UriComponentsBuilder.fromUriString("https://accounts.google.com/o/oauth2/v2/auth")
                .queryParam("client_id",clientId)
                .queryParam("redirect_uri",redirectUri)
                .queryParam("response_type","code")
                .queryParam("scope","openid+email+profile")
                .build().toUriString();


    }

    public ResponseEntity<?> handleGoogleCallBack(String code) {

        //1

        Map<String,String> tokenResponse=restTemplate.postForObject(
                "https://oauth2.googleapis.com/token",
                Map.of(
                        "code",code,
                        "client_id",clientId,
                        "client_secret",clientSecret,
                        "redirect_uri",redirectUri,
                        "grant_type","authorization_code"
                        ),
                Map.class
        );


        String accessToken=tokenResponse.get("access_token");

        if(accessToken==null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }


        //2



        Map<String,Object> userInfo=restTemplate.getForObject(
                "https://www.googleapis.com/oauth2/v3/userinfo?access_token="+accessToken,
                Map.class
        );

        String email=(String) (userInfo != null ? userInfo.get("email") : null);

        String userName=(String) (userInfo!=null? userInfo.get("name") : null);

        if(userName!=null) {
            int randNum=new SecureRandom().nextInt(10000);
            userName=userName+ randNum;
        }


        //3


        String jwtToken;

        UserModel user;

        if(userRepo.existsUserModelsByEmail(email)) {
            user=userRepo.findUserModelByEmail(email);

        }
        else {

            BCryptPasswordEncoder encoder=new BCryptPasswordEncoder(12);

            String randomPassword=encoder.encode(java.util.UUID.randomUUID().toString());

            user=UserModel.builder()
                    .userName(userName)
                    .email(email)
                    .password(randomPassword)
                    .build();

            userRepo.save(user);
        }

        jwtToken=jwtService.buildJwt(user);

        ResponseDTO response=ResponseDTO.builder()
                .userName(user.getUserName())
                .jwtToken(jwtToken)
                .build();




        return new ResponseEntity<>(response,HttpStatus.OK);

    }
}
