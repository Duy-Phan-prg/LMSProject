package com.Library.lmsproject.service.impl;

import com.Library.lmsproject.dto.request.*;
import com.Library.lmsproject.dto.response.LoginResponseDTO;
import com.Library.lmsproject.dto.response.UserResponseDTO;
import com.Library.lmsproject.entity.Roles;
import com.Library.lmsproject.entity.Users;
import com.Library.lmsproject.mapper.UserMapper;
import com.Library.lmsproject.repository.UsersRepository;
import com.Library.lmsproject.security.JwtTokenProvider;
import com.Library.lmsproject.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UsersRepository usersRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;


    @Override
    public UserResponseDTO register(UserRegisterRequestDTO request) {

        if (usersRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email " + request.getEmail() + " đã được sử dụng");
        }

        if (usersRepository.findByPhone(request.getPhone()).isPresent()) {
            throw new RuntimeException("Số điện thoại " + request.getPhone() + " đã được sử dụng");
        }

        Users user = userMapper.toUserEntity(request);
        user.setRole(Roles.MEMBER);
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userMapper.toUserResponseDTO(usersRepository.save(user));


    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {

        Users user = usersRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new RuntimeException("User account is not active");
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
    public Page<UserResponseDTO> getAllUser(String keyword, int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Users> usersPage =
                usersRepository.findByIsActiveTrueAndFullNameContainingIgnoreCase( // lay danh sach user isactive = true và false
                        keyword == null ? "" : keyword,
                        pageable
                );

        return usersPage.map(userMapper::toUserResponseDTO);
    }

    @Override
    public UserResponseDTO createUser(CreateUserRequestDTO request) {
        if (usersRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email " + request.getEmail() + " đã được sử dụng");
        }

        if (usersRepository.findByPhone(request.getPhone()).isPresent()) {
            throw new RuntimeException("Số điện thoại " + request.getPhone() + " đã được sử dụng");
        }

        Users user = userMapper.toUserEntity(request);
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        return userMapper.toUserResponseDTO(usersRepository.save(user));

    }

    @Override
    public Boolean deleteUser(Long id) {
        return usersRepository.findByIdAndIsActive(id, true).map(user -> {
                    user.setActive(false);
                    usersRepository.save(user);
                    return true;
                })
                .orElse(false);
    }

    @Override
    public UserResponseDTO updateUser(Long id, UpdateUserRequestDTO request) {
        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found or inactive"));

        user.setUpdatedAt(LocalDateTime.now());
        userMapper.updateUserFromDto(request, user);

        // validate email and phone uniqueness if they are being updated

        return userMapper.toUserResponseDTO(usersRepository.save(user));
    }

    @Override
    public UserResponseDTO getUserById(Long userId) {
        Users users = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found or inactive"));
        return userMapper.toUserResponseDTO(users);
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