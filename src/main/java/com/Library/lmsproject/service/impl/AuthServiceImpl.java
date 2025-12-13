package com.Library.lmsproject.service.impl;

import com.Library.lmsproject.dto.request.LoginRequestDTO;
import com.Library.lmsproject.dto.request.RefreshTokenRequestDTO;
import com.Library.lmsproject.dto.request.UserRegisterRequestDTO;
import com.Library.lmsproject.dto.response.LoginResponseDTO;
import com.Library.lmsproject.dto.response.UserResponseDTO;
import com.Library.lmsproject.entity.Roles;
import com.Library.lmsproject.entity.Users;
import com.Library.lmsproject.mapper.UserMapper;
import com.Library.lmsproject.repository.UsersRepository;
import com.Library.lmsproject.security.JwtTokenProvider;
import com.Library.lmsproject.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

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

        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        return LoginResponseDTO.builder()
                .id(user.getId())
                .role(user.getRole())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public LoginResponseDTO refreshToken(RefreshTokenRequestDTO request) {

        String refreshToken = request.getRefreshToken();

        // 1. Validate token (basic)
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        // 2. Lấy email từ refresh token
        String email = jwtTokenProvider.extractEmail(refreshToken);

        // 3. Check user còn tồn tại không
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 4. Generate access token mới
        String newAccessToken = jwtTokenProvider.generateAccessToken(email);

        // 5. Trả response (giữ refresh token cũ)
        return LoginResponseDTO.builder()
                .id(user.getId())
                .role(user.getRole())
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .build();
    }
}