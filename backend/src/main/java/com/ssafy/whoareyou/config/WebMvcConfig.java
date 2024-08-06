package com.ssafy.whoareyou.config;

import com.ssafy.whoareyou.interceptor.InterceptorHandler;
import com.ssafy.whoareyou.provider.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {
    private final JwtProvider provider;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry
                .addInterceptor(new InterceptorHandler(provider))
                .addPathPatterns("/chat-rooms/**")
                .addPathPatterns("/friends/**")
                .excludePathPatterns("/css/**", "/images/**", "/js/**");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "OPTIONS")
                .allowedHeaders("headers")
                .maxAge(3000);
    }
}
