package com.ssafy.whoareyou.user.service.implement;

import com.ssafy.whoareyou.user.dto.request.auth.*;
import com.ssafy.whoareyou.user.dto.response.ResponseDto;
import com.ssafy.whoareyou.user.dto.response.UserResponseDto;
import com.ssafy.whoareyou.user.dto.response.auth.*;
import com.ssafy.whoareyou.provider.JwtProvider;
import com.ssafy.whoareyou.user.entity.Female;
import com.ssafy.whoareyou.user.entity.Male;
import com.ssafy.whoareyou.user.entity.User;
import com.ssafy.whoareyou.user.repository.UserRepository;
import com.ssafy.whoareyou.user.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImplement implements AuthService {

    private final UserRepository userRepository;

    private final JwtProvider jwtProvider;

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
    public ResponseEntity<? super NicknameCheckResponseDto> nicknameCheck(NicknameCheckRequestDto dto) {

        try{

            String nickname = dto.getNickname();
            boolean isExisted = userRepository.findByNickname(nickname).isPresent();
            if(isExisted) return NicknameCheckResponseDto.duplicateNickname();

        }catch(Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return NicknameCheckResponseDto.success();
    }

    @Override
    public ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto) {

        try{

            String email = dto.getEmail();
            boolean isExisted = userRepository.findByEmail(email).isPresent();
            if(isExisted) return SignUpResponseDto.duplicateEmail();

            String nickname = dto.getNickname();
            boolean isExisted2 = userRepository.findByNickname(nickname).isPresent();
            if(isExisted2) return SignUpResponseDto.duplicateNickname();

            String password = dto.getPassword();
            String encodedPassword = passwordEncoder.encode(password);
            dto.setPassword(encodedPassword);


//            User userEntity = new User(dto);
            if(dto.getGender().equals("male")){
                Male male = new Male(dto);
                userRepository.save(male);
            }
            else{
                Female female = new Female(dto);
                userRepository.save(female);
            }

        } catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return SignUpResponseDto.success();
    }

    @Override
    public ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto) {
        String accessToken = null;
        String refreshToken = null;

        try {
            String email = dto.getEmail();
            Optional<User> userEntity = userRepository.findByEmail(email);
            if(userEntity.isEmpty()) return SignInResponseDto.signInFail();

            String password = dto.getPassword();
            String encodedPassword = userEntity.get().getPassword();
            boolean isMatched = passwordEncoder.matches(password, encodedPassword);
            if(!isMatched) return SignInResponseDto.signInFail();

            String userId = String.valueOf(userEntity.get().getId());
            accessToken = jwtProvider.createAccessToken(userId);
            refreshToken = jwtProvider.createRefreshToken(userId);

            // refreshToken을 데이터베이스에 저장
            userEntity.get().setRefreshToken(refreshToken);
            userRepository.save(userEntity.get());

        } catch(Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return SignInResponseDto.success(accessToken, refreshToken);
    }

    @Override
    public ResponseEntity<? super LogoutResponseDto> logout(LogoutRequestDto dto) {

        try {
            int userId = dto.getUserId();
            Optional<User> userEntity = userRepository.findById(userId);
            if(userEntity.isEmpty()) return LogoutResponseDto.logoutFail();

            userEntity.get().setRefreshToken(null);
            userRepository.save(userEntity.get());

        } catch(Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return LogoutResponseDto.success();
    }

    @Override
    public UserResponseDto getUserById(int id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        return new UserResponseDto(
                user.getEmail(),
                user.getName(),
                user.getNickname(),
                user.getType(),
                user.getSuccessCount(),
                user.getMatchingCount()
        );
    }


}
