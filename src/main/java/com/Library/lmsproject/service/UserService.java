package com.Library.lmsproject.service;


import com.Library.lmsproject.dto.request.CreateUserRequestDTO;
import com.Library.lmsproject.dto.request.LoginRequestDTO;
import com.Library.lmsproject.dto.request.RefreshTokenRequestDTO;
import com.Library.lmsproject.dto.request.UpdateUserRequestDTO;
import com.Library.lmsproject.dto.request.UserRegisterRequestDTO;

import com.Library.lmsproject.dto.response.LoginResponseDTO;
import com.Library.lmsproject.dto.response.UserResponseDTO;
import org.springframework.data.domain.Page;

import java.util.List;


public interface UserService {

    //kiểu dữ liệu (class)   tên hàm(kiểu của biến   biến đầu vào)
    // UserResponseDTO là những gì trả về sau khi đăng ký thành công
    // UserRegisterRequestDTO là những gì user cần nhập
     UserResponseDTO register(UserRegisterRequestDTO request);


    // LoginResponseDTO là những gì trả về sau khi đăng nhập thành công
    // Login RequestDTO là những gì user cần nhập
     LoginResponseDTO login(LoginRequestDTO request);
    LoginResponseDTO refreshToken(RefreshTokenRequestDTO request);

    Page<UserResponseDTO> getAllUser(String keyword, int page, int size);

    UserResponseDTO createUser(CreateUserRequestDTO request);

    Boolean deleteUser(Long userId);

    UserResponseDTO updateUser(Long userId, UpdateUserRequestDTO request);

    UserResponseDTO getUserById(Long userId);
}
