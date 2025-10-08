package com.alchemycare.userservice.service;

import com.alchemycare.userservice.dto.LoginDTO;
import com.alchemycare.userservice.dto.ResponseDTO;
import com.alchemycare.userservice.dto.SignupDTO;
import com.alchemycare.userservice.jwt.JwtService;
import com.alchemycare.userservice.model.UserModel;
import com.alchemycare.userservice.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    UserRepo userRepo;

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    JwtService jwtService;


    public ResponseEntity<?> login(LoginDTO loginDTO) {

        Authentication authentication=authManager.authenticate(new
                UsernamePasswordAuthenticationToken(loginDTO.getEmail(),loginDTO.getPassword())
        );

        if(!authentication.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }


        UserModel user=userRepo.findUserModelByEmail(loginDTO.getEmail());

        if(user==null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);

        }

        String jwt=jwtService.buildJwt(user);


        ResponseDTO resp=ResponseDTO.builder()
                .userName(user.getUserName())
                .jwtToken(jwt)
                .build();

        return new ResponseEntity<>(resp,HttpStatus.OK);



    }

    public ResponseEntity<?> signup(SignupDTO signupDTO) {

        if(userRepo.existsUserModelsByEmail(signupDTO.getEmail())) {
            return new ResponseEntity<>("user already exists",HttpStatus.BAD_REQUEST);
        }

        UserModel newUser= UserModel.builder()
                .userName(signupDTO.getUserName())
                .email(signupDTO.getEmail())
                .password(new BCryptPasswordEncoder(12).encode(signupDTO.getPassword()))
                .build();

        userRepo.save(newUser);

        String jwt=jwtService.buildJwt(newUser);

        ResponseDTO resp= ResponseDTO.builder()
                .userName(newUser.getUserName())
                .jwtToken(jwt)
                .build();


        return new ResponseEntity<>(resp,HttpStatus.CREATED);


    }
}
