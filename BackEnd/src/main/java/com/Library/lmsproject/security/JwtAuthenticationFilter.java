package com.library.lmsproject.security;

import com.library.lmsproject.repository.BlacklistRepository;
import com.library.lmsproject.repository.UserSessionRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService;
    private final BlacklistRepository blacklistRepository;
    private final UserSessionRepository userSessionRepository;

    /**
     * ✅ BỎ QUA JWT FILTER CHO:
     * - Swagger
     * - API public
     * - Preflight (OPTIONS)
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {

        String path = request.getServletPath();

        return HttpMethod.OPTIONS.matches(request.getMethod())

                // Swagger
                || path.startsWith("/swagger-ui")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/swagger-resources")
                || path.startsWith("/webjars")

                // Public APIs
                || path.equals("/api/user/login")
                || path.equals("/api/user/register")
                || path.equals("/api/user/refresh-token")

                || path.startsWith("/api/books")
                || path.startsWith("/api/categories")
                // Reviews public GET only
                || (path.startsWith("/api/reviews/book")
                && request.getMethod().equals("GET"))


                // Google OAuth2
                || path.startsWith("/oauth2")
                || path.startsWith("/login/oauth2");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // 🔹 Không có token → cho qua
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7).trim();


        try {
            // ❌ 1. Token đã bị blacklist
            if (blacklistRepository.existsByToken(token)) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token revoked");
                return;
            }

            // ❌ 2. Token không hợp lệ / không phải access token
            if (!jwtTokenProvider.validateToken(token)
                    || !jwtTokenProvider.isAccessToken(token)) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                return;
            }

            // ❌ 2. Token không hợp lệ / không phải access token
            if (!jwtTokenProvider.validateToken(token)
                    || !jwtTokenProvider.isAccessToken(token)) {

                response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "Invalid or expired access token"
                );
                return;
            }



            // ✅ 4. Authenticate
            String email = jwtTokenProvider.extractEmail(token);

            if (email != null
                    && SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails userDetails =
                        customUserDetailsService.loadUserByUsername(email);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

        } catch (Exception ex) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, ex.getMessage());
            return;
        }

        filterChain.doFilter(request, response);
    }
}
