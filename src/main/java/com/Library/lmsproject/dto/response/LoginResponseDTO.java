package com.Library.lmsproject.dto.response;


import com.Library.lmsproject.entity.Roles;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    private Long id;
    private String email;
    private String fullName;
    private String token;
}
