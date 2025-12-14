package com.Library.lmsproject.repository;

import com.Library.lmsproject.entity.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    @Query("""
    SELECT u FROM Users u
    WHERE (:keyword IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')))
    AND (:isActive IS NULL OR u.isActive = :isActive)
""")
    Page<Users> findAllUsers(
            @Param("keyword") String keyword,
            @Param("isActive") Boolean isActive,
            Pageable pageable
    );


}