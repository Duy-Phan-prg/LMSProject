package com.Library.lmsproject.security;

import com.Library.lmsproject.entity.Roles;
import com.Library.lmsproject.entity.Users;
import com.Library.lmsproject.repository.UsersRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UsersRepository usersRepository;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String providerId = oAuth2User.getAttribute("sub");

        Users user = usersRepository.findByEmail(email)
                .orElseGet(() -> createNewGoogleUser(email, name, providerId));

        // 👉 Sinh JWT
        String accessToken =
                jwtTokenProvider.generateAccessToken(user.getEmail(), user.getRole().name());

        String refreshToken =
                jwtTokenProvider.generateRefreshToken(user.getEmail());


        String redirectUrl =
                "http://localhost:3000/oauth2/callback"
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

        return usersRepository.save(user);
    }
}
