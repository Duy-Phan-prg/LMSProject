package com.Library.lmsproject.repository;

import com.Library.lmsproject.entity.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsersRepository
        extends JpaRepository<Users, Long> {   //→ Tự có đầy đủ CRUD: save(), findById(), findAll(), delete(), …

    Optional<Users> findByEmail(String email);

    Optional<Users> findByPhone(String phone);

    Optional<Users> findByIdAndIsActive(Long id, boolean isActive);

    Page<Users> findByIsActiveTrueAndFullNameContainingIgnoreCase(
            String fullName,
            Pageable pageable
    );

}