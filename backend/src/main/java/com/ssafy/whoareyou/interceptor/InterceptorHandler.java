package com.ssafy.whoareyou.interceptor;

import com.ssafy.whoareyou.provider.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

@Slf4j
@RequiredArgsConstructor
public class InterceptorHandler implements HandlerInterceptor {
    private final JwtProvider provider;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String accessToken = request.getHeader(HttpHeaders.AUTHORIZATION);
        response.addHeader(HttpHeaders.AUTHORIZATION, accessToken);

        String userId = provider.getUserId(accessToken.substring(7));

        log.info("userId 추출 완료: " + userId);

        request.setAttribute("userId", userId);

        return HandlerInterceptor.super.preHandle(request, response, handler);
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
    }
}
