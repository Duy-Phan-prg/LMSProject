package com.Library.lmsproject.mapper;

import com.Library.lmsproject.dto.request.UserRegisterRequestDTO;
import com.Library.lmsproject.dto.response.LoginResponseDTO;
import com.Library.lmsproject.entity.Users;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface UserMapper {

    LoginResponseDTO toUserResponseDTO(Users user);

    Users toUserEntity(UserRegisterRequestDTO request);
}