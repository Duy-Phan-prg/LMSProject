package com.Library.lmsproject.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class LoginResponseDTO {
    private String token;
    private UserResponseDTO user;
}