package com.library.lmsproject.repository;

import com.library.lmsproject.entity.UserSession;
import com.library.lmsproject.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserSessionRepository extends JpaRepository<UserSession, Long> {
    Optional<UserSession> findBySessionTokenAndTokenTypeAndIsActive(
            String token,
            String tokenType,
            Boolean isActive
    );

    List<UserSession> findAllByUserAndIsActive(Users user, Boolean isActive);

    Optional<Object> findBySessionTokenAndIsActive(String sessionToken, Boolean isActive);
}
