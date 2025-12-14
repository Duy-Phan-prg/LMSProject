package com.Library.lmsproject.controller;

import com.Library.lmsproject.dto.request.*;
import com.Library.lmsproject.dto.response.LoginResponseDTO;
import com.Library.lmsproject.dto.response.UserResponseDTO;
import com.Library.lmsproject.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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


    @GetMapping("/getAllUsers")
    public ResponseEntity<Page<UserResponseDTO>> getAllUser(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(userService.getAllUser(keyword, page, size));
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