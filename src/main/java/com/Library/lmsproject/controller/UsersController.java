package com.Library.lmsproject.controller;


import com.Library.lmsproject.dto.response.UsersResponseDTO;
import com.Library.lmsproject.entity.Users;
import com.Library.lmsproject.service.UsersService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UsersController {
    @Autowired
    private UsersService usersService;

//
//    @Operation(summary = "Get user by ID", description = "Retrieve user details by their unique ID")
//    @GetMapping("/getById")
//    public UsersResponseDTO getUserById(Long id){
//        return usersService.findUserById(id);
//    }

    // API REGISTER USER
    // B1. TẠO DTO REQUEST VÀ DTO RESPONSE , REQUEST VALIDATION,
    // B2. TẠO METHOD TRONG SERVICE, sau đó IMPLEMENT TRONG SERVICEIMPL
    // B3. TAO QUERY TRONG REPOSITORY NẾU CẦN
    // B4. TẠO CONTROLLER CALL SERVICE


    @PostMapping("/register")
    public UsersResponseDTO registerUser(UsersResponseDTO usersResponseDTO){
        return null;
    }



}
