package com.ssafy.whoareyou.handler;

import com.ssafy.whoareyou.user.entity.User;
import com.ssafy.whoareyou.user.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.ssafy.whoareyou.user.entity.CustomOAuth2User;
import com.ssafy.whoareyou.provider.JwtProvider;

import java.io.IOException;
import java.util.Optional;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler  extends SimpleUrlAuthenticationSuccessHandler{

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

//    @Override
//    public void onAuthenticationSuccess(
//            HttpServletRequest request,
//            HttpServletResponse response,
//            Authentication authentication
//    ) throws IOException, ServletException {
//
//        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
//        String email = oAuth2User.getName();
//
//        Optional<User> user = userRepository.findByEmail(email);
//        String userId = String.valueOf(user.get().getId());
//        String token = jwtProvider.create(userId);
//        System.out.println("아니이거왜안됨????????????");
//        response.sendRedirect("http://localhost:3000/auth/oauth-response/" + token + "/3600");
//
//    }
    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        try {

            CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
            String email = oAuth2User.getName();
            System.out.println("이메일: " + email);
            Optional<User> user = userRepository.findByEmail(email);
            if (user.isPresent()) {
                String userId = String.valueOf(user.get().getId());
                System.out.println("사용자 ID: " + userId);

                String token = jwtProvider.create(userId);
                System.out.println("생성된 토큰: " + token);

                String redirectUrl = "http://localhost:3000/auth/oauth-response/" + token + "/3600";
                System.out.println("리다이렉션 URL: " + redirectUrl);

                response.sendRedirect(redirectUrl);
            } else {
                System.out.println("사용자를 찾을 수 없습니다.");
                response.sendRedirect("http://localhost:3000/error");
            }
        } catch (Exception e) {
            System.out.println("인증 성공 처리 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            response.sendRedirect("http://localhost:3000/error");
        }
    }
}
