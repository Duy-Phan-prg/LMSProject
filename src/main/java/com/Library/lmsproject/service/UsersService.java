package com.Library.lmsproject.service;

import com.Library.lmsproject.dto.request.LoginRequestDTO;
import com.Library.lmsproject.dto.request.UserRegisterRequestDTO;
import com.Library.lmsproject.dto.response.LoginResponseDTO;

public interface UsersService {
    LoginResponseDTO getUserById(Long id);

    LoginResponseDTO register(UserRegisterRequestDTO request);

    LoginResponseDTO login(LoginRequestDTO request);

}
