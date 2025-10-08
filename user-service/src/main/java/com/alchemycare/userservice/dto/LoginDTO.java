package com.alchemycare.userservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginDTO {

    @Email
    @NotBlank(message = "email is required" )
    private String email;

    @Size(min = 8)
    @NotBlank(message = "password is required")
    private String password;
}
