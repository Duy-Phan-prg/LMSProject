package com.Library.lmsproject.dto.response;

import com.Library.lmsproject.entity.Roles;
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