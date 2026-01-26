package com.library.lmsproject.service;


import com.library.lmsproject.dto.request.CreateUserRequestDTO;
import com.library.lmsproject.dto.request.LoginRequestDTO;
import com.library.lmsproject.dto.request.RefreshTokenRequestDTO;
import com.library.lmsproject.dto.request.UpdateUserRequestDTO;
import com.library.lmsproject.dto.request.UserRegisterRequestDTO;

import com.library.lmsproject.dto.response.LoginResponseDTO;
import com.library.lmsproject.dto.response.UserResponseDTO;
import org.springframework.data.domain.Page;


public interface UserService {

     UserResponseDTO register(UserRegisterRequestDTO request);

     LoginResponseDTO login(LoginRequestDTO request);

     void logout(String token);

     void logoutUser(Long userId);
    LoginResponseDTO refreshToken(RefreshTokenRequestDTO request);

//    Page<UserResponseDTO> getAllUser(String keyword, int page, int size);

    Page<UserResponseDTO> getAllUser(
            String keyword,
            Boolean isActive,
            int page,
            int size
    );

    UserResponseDTO createUser(CreateUserRequestDTO request);

    Boolean deleteUser(Long userId);

    UserResponseDTO updateUser(Long userId, UpdateUserRequestDTO request);

    UserResponseDTO getUserById(Long userId);
}
