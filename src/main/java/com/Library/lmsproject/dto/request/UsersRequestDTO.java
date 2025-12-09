package com.Library.lmsproject.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsersRequestDTO {
    private String email;
    private String password;
    private String fullName;
    private String phone;
    private String address;

}
