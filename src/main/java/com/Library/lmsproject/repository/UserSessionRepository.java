package com.Library.lmsproject.repository;

import com.Library.lmsproject.entity.UserSession;
import com.Library.lmsproject.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserSessionRepository extends JpaRepository<UserSession, Long> {
    Optional<UserSession> findBySessionTokenAndIsActive(String sessionToken, Boolean isActive);

    List<UserSession> findAllByUserAndIsActive(Users user, Boolean isActive);

}
