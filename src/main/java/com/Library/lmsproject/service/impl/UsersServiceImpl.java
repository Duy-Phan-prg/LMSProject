package com.Library.lmsproject.service.impl;

import com.Library.lmsproject.dto.request.LoginRequestDTO;
import com.Library.lmsproject.dto.request.UserRegisterRequestDTO;
import com.Library.lmsproject.dto.response.UsersResponseDTO;
import com.Library.lmsproject.entity.Roles;
import com.Library.lmsproject.entity.Users;
import com.Library.lmsproject.mapper.UserMapper;
import com.Library.lmsproject.repository.UsersRepository;
import com.Library.lmsproject.security.JwtTokenProvider;
import com.Library.lmsproject.service.UsersService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsersServiceImpl implements UsersService {

    private final UsersRepository usersRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public UsersResponseDTO getUserById(Long id) {
        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userMapper.toUserResponseDTO(user);
    }

    @Override
    public UsersResponseDTO register(UserRegisterRequestDTO request) {

        if (usersRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        Users user = userMapper.toUserEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Roles.valueOf(request.getRole().toUpperCase()));

        usersRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getEmail());

        UsersResponseDTO dto = userMapper.toUserResponseDTO(user);
        dto.setToken(token);

        return dto;
    }

    @Override
    public UsersResponseDTO login(LoginRequestDTO request) {

        Users user = usersRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail());

        UsersResponseDTO dto = userMapper.toUserResponseDTO(user);
        dto.setToken(token);

        return dto;
    }
}