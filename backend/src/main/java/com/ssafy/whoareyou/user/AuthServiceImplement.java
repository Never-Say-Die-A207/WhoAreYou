package com.ssafy.whoareyou.user;

import com.ssafy.whoareyou.dto.request.auth.EmailCheckRequestDto;
import com.ssafy.whoareyou.dto.request.auth.SignUpRequestDto;
import com.ssafy.whoareyou.dto.response.ResponseDto;
import com.ssafy.whoareyou.dto.response.auth.EmailCheckResponseDto;
import com.ssafy.whoareyou.dto.response.auth.SignUpResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImplement implements AuthService{

    private final UserRepository userRepository;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public ResponseEntity<? super EmailCheckResponseDto> emailCheck(EmailCheckRequestDto dto) {

        try{

            String email = dto.getEmail();
            boolean isExisted = userRepository.findByEmail(email).isPresent();
            if(isExisted) return EmailCheckResponseDto.duplicateEmail();

        }catch(Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return EmailCheckResponseDto.success();
    }

    @Override
    public ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto) {

        try{

            String email = dto.getEmail();
            boolean isExisted = userRepository.findByEmail(email).isPresent();
            if(isExisted) return EmailCheckResponseDto.duplicateEmail();

            String password = dto.getPassword();
            String encodedPassword = passwordEncoder.encode(password);
            dto.setPassword(encodedPassword);

            User userEntity = new User(dto);
            userRepository.save(userEntity);

        } catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return SignUpResponseDto.success();
    }

}
