package com.Library.lmsproject.security;

import com.Library.lmsproject.repository.BlacklistRepository;
import com.Library.lmsproject.repository.UserSessionRepository;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
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

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // Skip filtering for preflight requests
        return HttpMethod.OPTIONS.matches(request.getMethod());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            try {
                // ❌ 1. Token đã bị blacklist
                if (blacklistRepository.existsByToken(token)) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token revoked");
                    return;
                }

                // ❌ 2. Token không hợp lệ hoặc không phải access token
                if (!jwtTokenProvider.validateToken(token)
                        || !jwtTokenProvider.isAccessToken(token)) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                    return;
                }

                // ❌ 3. Session không active (đã logout / bị kick)
                userSessionRepository
                        .findBySessionTokenAndIsActive(token, true)
                        .orElseThrow(() ->
                                new RuntimeException("Session inactive")
                        );

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
        }

        filterChain.doFilter(request, response);
    }
}
