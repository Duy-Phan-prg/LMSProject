package com.Library.lmsproject.repository;

import com.Library.lmsproject.entity.BlacklistedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlacklistRepository
        extends JpaRepository<BlacklistedToken, Long> {

    boolean existsByToken(String token);
}