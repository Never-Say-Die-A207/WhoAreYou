package com.ssafy.whoareyou.user;

import com.ssafy.whoareyou.dto.request.auth.EmailCheckRequestDto;
import com.ssafy.whoareyou.dto.request.auth.SignUpRequestDto;
import com.ssafy.whoareyou.dto.response.ResponseDto;
import com.ssafy.whoareyou.dto.response.auth.EmailCheckResponseDto;
import com.ssafy.whoareyou.dto.response.auth.SignUpResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImplement implements AuthService{

    private final UserRepository userRepository;

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

            User userEntity = new User(dto);
            userRepository.save(userEntity);

        } catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return SignUpResponseDto.success();
    }

}
