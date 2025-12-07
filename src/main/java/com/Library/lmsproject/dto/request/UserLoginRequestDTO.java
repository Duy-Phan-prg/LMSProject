package com.Library.lmsproject.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginRequestDTO {
    @Email
    @NotBlank (message = "Email is required")
    private String email;

    @NotBlank (message = "Password is required")
    private String password;

}
