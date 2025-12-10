package com.Library.lmsproject.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private UserResponseDTO user;
}