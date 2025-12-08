package com.Library.lmsproject.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtTokenProvider {

    private final String secretKey = "THIS_IS_SECRET_KEY_256_ABCXYZ1234567890";
    private final long expirationMs = 86400000;

    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes()))
                .compact();
    }

    public String extractEmail(String token) {
        JwtParser parser = Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(secretKey.getBytes()))
                .build();

        return parser.parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }
}