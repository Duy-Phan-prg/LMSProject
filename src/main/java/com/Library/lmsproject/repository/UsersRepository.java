package com.Library.lmsproject.repository;

import com.Library.lmsproject.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsersRepository
        extends JpaRepository<Users, Long> {   //→ Tự có đầy đủ CRUD: save(), findById(), findAll(), delete(), …

    Optional<Users> findByEmail(String email);

    List<Users> findByIsActive(boolean isActive);
}