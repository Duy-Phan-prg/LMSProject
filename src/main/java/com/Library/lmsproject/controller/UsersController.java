package com.Library.lmsproject.controller;

import com.Library.lmsproject.dto.response.LoginResponseDTO;
import com.Library.lmsproject.service.UsersService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UsersController {

    private final UsersService usersService;

    @GetMapping("/{id}")
    public LoginResponseDTO getUserById(@PathVariable Long id) {
        return usersService.getUserById(id);
    }
}