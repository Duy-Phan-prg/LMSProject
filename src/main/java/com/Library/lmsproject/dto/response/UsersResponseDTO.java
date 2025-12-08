package com.Library.lmsproject.dto.response;


import com.Library.lmsproject.entity.Roles;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsersResponseDTO {
    private Long id;
    private String email;
    private String fullName;
    private Roles role;
    private String token;
}
