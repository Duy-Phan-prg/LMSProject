package com.Library.lmsproject.service.impl;

import com.Library.lmsproject.dto.request.LoginRequestDTO;
import com.Library.lmsproject.dto.request.UserRegisterRequestDTO;
import com.Library.lmsproject.dto.response.LoginResponseDTO;
import com.Library.lmsproject.dto.response.UserResponseDTO;
import com.Library.lmsproject.entity.Roles;
import com.Library.lmsproject.entity.Users;
import com.Library.lmsproject.mapper.UserMapper;
import com.Library.lmsproject.repository.UsersRepository;
import com.Library.lmsproject.security.JwtTokenProvider;
import com.Library.lmsproject.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UsersRepository usersRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;


    @Override
    public UserResponseDTO register(UserRegisterRequestDTO request) {

        if (usersRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        Users user = userMapper.toUserEntity(request);
        user.setRole(Roles.MEMBER);
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        usersRepository.save(user);

        return userMapper.toUserResponseDTO(user);
    }



    public LoginResponseDTO login(LoginRequestDTO request) {

        Users user = usersRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail());

        return new LoginResponseDTO(token, userMapper.toUserResponseDTO(user));
    }
}