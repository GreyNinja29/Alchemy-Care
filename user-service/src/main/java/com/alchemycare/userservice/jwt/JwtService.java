package com.alchemycare.userservice.jwt;

import com.alchemycare.userservice.model.UserModel;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.key}")
    private String jwtKey;

    public String buildJwt(UserModel user) {

            return Jwts.builder()
                    .subject(user.getEmail())
                    .claim("userId",user.getUserId())
                    .issuedAt(new Date(System.currentTimeMillis()))
                    .signWith(getKey())
                    .compact();

    }

    public SecretKey getKey() {
        return Keys.hmacShaKeyFor(jwtKey.getBytes(StandardCharsets.UTF_8));
    }

    public boolean validateJwt(String jwt) {
        try {
            Jwts.parser()
                    .verifyWith(getKey())
                    .build()
                    .parseSignedClaims(jwt);



            return true;

        }
        catch (JwtException ex) {
            System.out.println("Invalid jwt " + ex.getMessage());
        }

        return false;

    }

    public String extractUserEmail(String jwt) {

        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(jwt)
                .getPayload()
                .getSubject();
    }
}
