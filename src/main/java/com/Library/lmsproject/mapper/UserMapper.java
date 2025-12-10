package com.Library.lmsproject.mapper;

import com.Library.lmsproject.dto.request.UserRegisterRequestDTO;
import com.Library.lmsproject.dto.response.UserResponseDTO;
import com.Library.lmsproject.entity.Users;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponseDTO toUserResponseDTO(Users user);

//    // RegisterDTO -> Entity (nhận từ client để lưu DB)
//    @Mapping(target = "id", ignore = true)
//    @Mapping(target = "role", ignore = true)
//    @Mapping(target = "active", ignore = true)
//    @Mapping(target = "avatar", ignore = true)
//    @Mapping(target = "createdAt", ignore = true)
//    @Mapping(target = "updatedAt", ignore = true)
//    @Mapping(target = "password", ignore = true)
    Users toUserEntity(UserRegisterRequestDTO request);
}
