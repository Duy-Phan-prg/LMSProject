package com.library.lmsproject.security;

import com.library.lmsproject.entity.Roles;
import com.library.lmsproject.entity.UserSession;
import com.library.lmsproject.entity.Users;
import com.library.lmsproject.repository.UserSessionRepository;
import com.library.lmsproject.repository.UsersRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UsersRepository usersRepository;
    private final UserSessionRepository userSessionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String providerId = oAuth2User.getAttribute("sub");

        // Tìm hoặc tạo user
        Users user = usersRepository.findByEmail(email)
                .orElseGet(() -> createNewGoogleUser(email, name, providerId));

        // 👉 Sinh JWT
        String accessToken =
                jwtTokenProvider.generateAccessToken(user.getEmail(), user.getRole().name());

        String refreshToken =
                jwtTokenProvider.generateRefreshToken(user.getEmail());

        // 👉 Lưu UserSession cho ACCESS token
        UserSession accessSession = new UserSession();
        accessSession.setSessionToken(accessToken);
        accessSession.setTokenType("ACCESS");
        accessSession.setIsActive(true);
        accessSession.setLoginTime(LocalDateTime.now());
        accessSession.setUser(user);
        userSessionRepository.save(accessSession);

        // 👉 Lưu UserSession cho REFRESH token
        UserSession refreshSession = new UserSession();
        refreshSession.setSessionToken(refreshToken);
        refreshSession.setTokenType("REFRESH");
        refreshSession.setIsActive(true);
        refreshSession.setLoginTime(LocalDateTime.now());
        refreshSession.setUser(user);
        userSessionRepository.save(refreshSession);

        String redirectUrl =
                "http://localhost:5173/oauth2/callback"
                        + "?accessToken=" + accessToken
                        + "&refreshToken=" + refreshToken;

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }

    private Users createNewGoogleUser(String email, String name, String providerId) {
        Users user = new Users();
        user.setEmail(email);
        user.setFullName(name);
        user.setRole(Roles.MEMBER);
        user.setOauth2User(true);
        user.setProvider("GOOGLE");
        user.setProviderId(providerId);
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        
        // Tạo password mặc định cho user Google
        // User có thể đổi password sau nếu muốn login bằng email/password
        String defaultPassword = "Password@123";
        user.setPassword(passwordEncoder.encode(defaultPassword));

        return usersRepository.save(user);
    }
}
