package com.Library.lmsproject.mapper;

import com.Library.lmsproject.dto.request.UsersRequestDTO;
import com.Library.lmsproject.dto.response.UsersResponseDTO;
import com.Library.lmsproject.entity.Users;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface UserMapper {
    UsersResponseDTO toUsersDTO(Users user);
    Users toUsers(UsersRequestDTO usersRequestDTO);
}
