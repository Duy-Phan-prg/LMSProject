package com.Library.lmsproject.service.impl;

import com.Library.lmsproject.dto.request.*;
import com.Library.lmsproject.dto.response.LoginResponseDTO;
import com.Library.lmsproject.dto.response.UserResponseDTO;
import com.Library.lmsproject.entity.BlacklistedToken;
import com.Library.lmsproject.entity.Roles;
import com.Library.lmsproject.entity.UserSession;
import com.Library.lmsproject.entity.Users;
import com.Library.lmsproject.mapper.UserMapper;
import com.Library.lmsproject.repository.BlacklistRepository;
import com.Library.lmsproject.repository.UserSessionRepository;
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
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UsersRepository usersRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserSessionRepository userSessionRepository;
    private final BlacklistRepository blacklistRepository;

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
    @Transactional
    public LoginResponseDTO login(LoginRequestDTO request) {
        Users user = usersRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getEmail(),
                user.getRole().name()
        );

        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        userSessionRepository.save(
                new UserSession(
                        null,
                        accessToken,
                        "ACCESS",
                        true,
                        LocalDateTime.now(),
                        null,
                        user
                )
        );

        userSessionRepository.save(
                new UserSession(
                        null,
                        refreshToken,
                        "REFRESH",
                        true,
                        LocalDateTime.now(),
                        null,
                        user
                )
        );

        return LoginResponseDTO.builder()
                .id(user.getId())
                .role(user.getRole())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public void logout(String token) {

        // 1. Blacklist token
        Date exp = jwtTokenProvider.getExpiration(token);
        BlacklistedToken blacklistedToken =
                new BlacklistedToken(null, token, exp);
        blacklistRepository.save(blacklistedToken);

        // 2. Invalidate session
        userSessionRepository
                .findBySessionTokenAndTokenTypeAndIsActive(
                        token,
                        "ACCESS",
                        true
                )
                .ifPresent((UserSession session) -> {
                    session.setIsActive(false);
                    session.setLogoutTime(LocalDateTime.now());
                });
    }

    @Override
    public void logoutUser(Long userId) {

        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<UserSession> sessions =
                userSessionRepository.findAllByUserAndIsActive(user, true);

        for (UserSession s : sessions) {
            s.setIsActive(false);
            s.setLogoutTime(LocalDateTime.now());

            Date exp = jwtTokenProvider.getExpiration(s.getSessionToken());
            blacklistRepository.save(
                    new BlacklistedToken(null, s.getSessionToken(), exp)
            );
        }
    }
    @Transactional
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
    @Transactional
    @Override
    public Boolean deleteUser(Long id) {
        return usersRepository.findByIdAndIsActive(id, true).map(user -> {
                    user.setActive(false);
                    usersRepository.save(user);
                    return true;
                })
                .orElse(false);
    }
    @Transactional
    @Override
    public UserResponseDTO updateUser(Long id, UpdateUserRequestDTO request) {
        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found or inactive"));

        if (usersRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
            throw new RuntimeException("Email đã được sử dụng");
        }
        if (usersRepository.existsByPhoneAndIdNot(request.getPhone(), id)) {
            throw new RuntimeException("Số điện thoại đã được sử dụng");
        }

        // validate email and phone uniqueness if they are being updated
        user.setUpdatedAt(LocalDateTime.now());
        userMapper.updateUserFromDto(request, user);
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

        if (!jwtTokenProvider.validateToken(refreshToken)
                || !jwtTokenProvider.isRefreshToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        UserSession refreshSession =
                userSessionRepository
                        .findBySessionTokenAndTokenTypeAndIsActive(
                                refreshToken,
                                "REFRESH",
                                true
                        )
                        .orElseThrow(() ->
                                new RuntimeException("Refresh token expired")
                        );

        Users user = refreshSession.getUser();

        // deactivate all old sessions
        List<UserSession> sessions =
                userSessionRepository.findAllByUserAndIsActive(user, true);

        for (UserSession s : sessions) {
            s.setIsActive(false);
            s.setLogoutTime(LocalDateTime.now());
        }
        userSessionRepository.saveAll(sessions);

        String newAccessToken = jwtTokenProvider.generateAccessToken(
                user.getEmail(),
                user.getRole().name()
        );

        userSessionRepository.save(
                new UserSession(
                        null,
                        newAccessToken,
                        "ACCESS",
                        true,
                        LocalDateTime.now(),
                        null,
                        user
                )
        );

        return LoginResponseDTO.builder()
                .id(user.getId())
                .role(user.getRole())
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public Page<UserResponseDTO> getAllUser(String keyword, Boolean isActive, int page, int size) {
        Pageable pageable =
                PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Users> usersPage =
                usersRepository.findAllUsers(keyword, isActive, pageable);

        return usersPage.map(userMapper::toUserResponseDTO);

    }


}