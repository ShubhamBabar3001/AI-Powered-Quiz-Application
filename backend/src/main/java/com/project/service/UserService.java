package com.project.service;

import com.project.dto.request.UpdateProfileRequest;
import com.project.dto.response.AuthResponse;
import com.project.dto.response.UserProfileResponse;
import com.project.entity.User;
import com.project.exception.CustomException;
import com.project.mapper.UserMapper;
import com.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserProfileResponse getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found"));
        return userMapper.toProfileResponse(user);
    }
    public AuthResponse getUser(String email){
        User user = userRepository.findByEmail(email).orElseThrow(()->new CustomException("User not found"));
        return AuthResponse.builder()
                .token(null)
                .type("Bearer")
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRoles().get(0))
                .build();
    }
    public User getUserByEmail(String email){
        return userRepository.findByEmail(email).orElseThrow(()->new CustomException("User not found"));
    }
    public UserProfileResponse updateProfile(String userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found"));

        if (request.getName() != null) {
            user.setName(request.getName());
        }

        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return userMapper.toProfileResponse(user);
    }
}
