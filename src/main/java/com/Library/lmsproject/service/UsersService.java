package com.Library.lmsproject.service;

import com.Library.lmsproject.dto.request.LoginRequestDTO;
import com.Library.lmsproject.dto.request.UserRegisterRequestDTO;
import com.Library.lmsproject.dto.response.UsersResponseDTO;

public interface UsersService {
    UsersResponseDTO getUserById(Long id);

    UsersResponseDTO register(UserRegisterRequestDTO request);

    UsersResponseDTO login(LoginRequestDTO request);

}
