package com.sports.sportsnet.services;

import com.sports.sportsnet.dto.AuthResponse;
import com.sports.sportsnet.dto.LoginRequest;
import com.sports.sportsnet.dto.SignupRequest;
import com.sports.sportsnet.entity.User;
import com.sports.sportsnet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.sports.sportsnet.security.JwtUtil;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .telephone(request.getTelephone())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        User saved = userRepository.save(user);

        String token = jwtUtil.generateAccessToken(saved.getUserId().toString(), saved.getEmail(), "USER");
        return new AuthResponse(token, saved.getUserId().toString(), saved.getFullName(), saved.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtUtil.generateAccessToken(user.getUserId().toString(), user.getEmail(), "USER");
        return new AuthResponse(token, user.getUserId().toString(), user.getFullName(), user.getEmail());
    }
}