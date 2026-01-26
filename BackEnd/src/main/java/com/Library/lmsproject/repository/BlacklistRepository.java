package com.library.lmsproject.repository;

import com.library.lmsproject.entity.BlacklistedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlacklistRepository
        extends JpaRepository<BlacklistedToken, Long> {

    boolean existsByToken(String token);
}