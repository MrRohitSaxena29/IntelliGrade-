package com.intelligrade.controller;

import com.intelligrade.dto.AuthDto;
import com.intelligrade.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthDto.AuthResponse> login(@RequestBody AuthDto.LoginRequest request) {
        AuthDto.AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthDto.UserProfileDto> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        AuthDto.UserProfileDto profile = authService.getCurrentUser(email);
        return ResponseEntity.ok(profile);
    }
}
