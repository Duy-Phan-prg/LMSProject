package com.Library.lmsproject.service;


import com.Library.lmsproject.dto.request.LoginRequestDTO;
import com.Library.lmsproject.dto.request.RefreshTokenRequestDTO;
import com.Library.lmsproject.dto.request.UserRegisterRequestDTO;

import com.Library.lmsproject.dto.response.LoginResponseDTO;
import com.Library.lmsproject.dto.response.UserResponseDTO;


public interface AuthService {

    //kiểu dữ liệu (class)   tên hàm(kiểu của biến   biến đầu vào)
    // UserResponseDTO là những gì trả về sau khi đăng ký thành công
    // UserRegisterRequestDTO là những gì user cần nhập
    public UserResponseDTO register(UserRegisterRequestDTO request);


    // LoginResponseDTO là những gì trả về sau khi đăng nhập thành công
    // Login RequestDTO là những gì user cần nhập
    public LoginResponseDTO login(LoginRequestDTO request);
    LoginResponseDTO refreshToken(RefreshTokenRequestDTO request);
}
