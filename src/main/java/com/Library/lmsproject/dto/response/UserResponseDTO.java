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
public class UserResponseDTO {

    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private String address;
    private Roles role;
    private boolean isActive;
    private String avatar;
}