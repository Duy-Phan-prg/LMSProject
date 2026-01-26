package com.library.lmsproject.dto.response;

import com.library.lmsproject.entity.Roles;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    private Long id;
    private Roles role;
    private String accessToken;
    private String refreshToken;
}