package com.ssafy.whoareyou.user;

import java.util.Map;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.whoareyou.user.CustomOAuth2User;
import com.ssafy.whoareyou.user.User;
import com.ssafy.whoareyou.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OAuth2UserServiceImplement extends DefaultOAuth2UserService{

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException{

        OAuth2User oAuth2User = super.loadUser(request);
        String oauthClientName = request.getClientRegistration().getClientName();

        try{
            System.out.println(new ObjectMapper().writeValueAsString(oAuth2User.getAttributes()));
        } catch (Exception exception){
            exception.printStackTrace();
        }

        User userEntity = null;
        String email="email@email.com", name, nickname, gender;

        if(oauthClientName.equals("naver")){
            Map<String, String> responseMap = (Map<String, String>) oAuth2User.getAttributes().get("response");
            email = responseMap.get("email");
            name = responseMap.get("name");
            nickname = responseMap.get("nickname");
            gender = responseMap.get("gender");
            userEntity = new User(email, name, nickname, gender, "naver");
        }

        userRepository.save(userEntity);

        return new CustomOAuth2User(email);
    }
}
