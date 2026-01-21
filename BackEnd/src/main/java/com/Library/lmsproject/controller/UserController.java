package com.Library.lmsproject.controller;

import com.Library.lmsproject.dto.request.*;
import com.Library.lmsproject.dto.response.LoginResponseDTO;
import com.Library.lmsproject.dto.response.UserResponseDTO;
import com.Library.lmsproject.security.CustomUserDetails;
import com.Library.lmsproject.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(userService.login(request));
    }

    // fix
    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody UserRegisterRequestDTO request) {
        return ResponseEntity.ok(userService.register(request));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<LoginResponseDTO> refreshToken(
            @RequestBody RefreshTokenRequestDTO request) {
        return ResponseEntity.ok(userService.refreshToken(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> me(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        
        // Lấy thông tin user từ database và trả về UserResponseDTO
        return ResponseEntity.ok(userService.getUserById(userDetails.getId()));
    }

    @GetMapping("/google-login")
    public void googleLogin(HttpServletResponse response) throws IOException {
        // redirect sang endpoint OAuth2 của Spring Security
        response.sendRedirect("/oauth2/authorization/google");
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<Page<UserResponseDTO>> getAllUser(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<UserResponseDTO> result =
                userService.getAllUser(keyword, isActive, page, size);

        return ResponseEntity.ok(result);
    }

    // logout
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @RequestHeader("Authorization") String header
    ) {
        String token = header.replace("Bearer ", "");
        userService.logout(token);
        return ResponseEntity.ok("Logout success");
    }

    // create user (by admin)
    @PostMapping("/create")
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody CreateUserRequestDTO request) {
        return ResponseEntity.ok(userService.createUser(request));
    }

    // delete user
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        Boolean deleted = userService.deleteUser(id);
        if (deleted) {
            return ResponseEntity.ok("User with ID " + id + " has been deactivated.");
        } else {
            return ResponseEntity.status(404).body("User with ID " + id + " not found.");
        }
    }

    // update user
    @PutMapping("/update/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequestDTO request) {
        return ResponseEntity.ok(userService.updateUser(id, request));

    }
    // get user by id (view user details)
    @GetMapping("/getUserById/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }
}