package com.Library.lmsproject.mapper;

import com.Library.lmsproject.dto.request.CreateUserRequestDTO;
import com.Library.lmsproject.dto.request.UpdateUserRequestDTO;
import com.Library.lmsproject.dto.request.UserRegisterRequestDTO;
import com.Library.lmsproject.dto.response.UserResponseDTO;
import com.Library.lmsproject.entity.Users;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponseDTO toUserResponseDTO(Users user);
    Users toUserEntity(UserRegisterRequestDTO request);
    Users toUserEntity(CreateUserRequestDTO request);


    void updateUserFromDto(UpdateUserRequestDTO dto, @MappingTarget Users user);

}
