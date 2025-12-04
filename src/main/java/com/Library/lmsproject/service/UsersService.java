package com.Library.lmsproject.service;

import com.Library.lmsproject.dto.request.UserRegisterRequestDTO;
import com.Library.lmsproject.dto.response.UsersResponseDTO;
import com.Library.lmsproject.entity.Users;

public interface UsersService {
    UsersResponseDTO findUserById(Long id);

    UserRegisterRequestDTO registerUser(UserRegisterRequestDTO userRegisterRequestDTO);
}
