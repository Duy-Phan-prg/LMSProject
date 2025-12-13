package com.Library.lmsproject.service.impl;


import com.Library.lmsproject.dto.response.UserResponseDTO;
import com.Library.lmsproject.mapper.UserMapper;
import com.Library.lmsproject.repository.UsersRepository;
import com.Library.lmsproject.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private UserMapper userMapper;

    @Override
    public List<UserResponseDTO> getAllUsers() {
        return usersRepository.findByIsActive(true).stream().map(userMapper::toUserResponseDTO).toList();
    }
}
