package com.Library.lmsproject.service.impl;

//import com.Library.lmsproject.dto.request.UserRegisterRequestDTO;
import com.Library.lmsproject.dto.response.UsersResponseDTO;
import com.Library.lmsproject.entity.Users;
import com.Library.lmsproject.mapper.UserMapper;
import com.Library.lmsproject.repository.UsersRepo;
import com.Library.lmsproject.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UsersService {
   @Autowired
   private UsersRepo userRepo;

   @Autowired
   private UserMapper userMapper;
    @Override


    public UsersResponseDTO findUserById(Long id) {
        Users user = userRepo.findUserById(id);
        return userMapper.toUsersDTO(user);
    }
//
//    @Override
//    public UserRegisterRequestDTO registerUser(UserRegisterRequestDTO userRegisterRequestDTO) {
//
//        return null;
//    }
}
