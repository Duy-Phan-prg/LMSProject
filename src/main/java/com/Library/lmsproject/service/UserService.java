package com.Library.lmsproject.service;

import com.Library.lmsproject.dto.response.UserResponseDTO;

import java.util.List;

public interface UserService {
    List<UserResponseDTO> getAllUsers();
}
