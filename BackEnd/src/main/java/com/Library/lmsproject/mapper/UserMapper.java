package com.library.lmsproject.mapper;

import com.library.lmsproject.dto.request.CreateUserRequestDTO;
import com.library.lmsproject.dto.request.UpdateUserRequestDTO;
import com.library.lmsproject.dto.request.UserRegisterRequestDTO;
import com.library.lmsproject.dto.response.UserResponseDTO;
import com.library.lmsproject.entity.Users;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponseDTO toUserResponseDTO(Users user);
    Users toUserEntity(UserRegisterRequestDTO request);
    Users toUserEntity(CreateUserRequestDTO request);


    void updateUserFromDto(UpdateUserRequestDTO dto, @MappingTarget Users user);

}
