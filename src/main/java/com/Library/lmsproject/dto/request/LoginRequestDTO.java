package com.Library.lmsproject.dto.request;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequestDTO {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;
}