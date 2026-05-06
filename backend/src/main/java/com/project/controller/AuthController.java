package com.project.controller;

import com.project.dto.request.ChangePasswordRequest;
import com.project.dto.request.ForgotPasswordRequest;
import com.project.dto.request.LoginRequest;
import com.project.dto.request.SignupRequest;
import com.project.dto.response.AuthResponse;
import com.project.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    @Value("${cookie.name}")
    private String cookieName;

    @Value("${cookie.time}")
    private long cookieTime;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(
            @Valid @RequestBody SignupRequest request, HttpServletResponse response
    ) {
        AuthResponse authResponse  = authService.signup(request);
        setAuthCookie(response, authResponse.getToken());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request, HttpServletResponse response
    ) {
        AuthResponse authResponse = authService.login(request);
        setAuthCookie(response, authResponse.getToken());
        return ResponseEntity.ok(authResponse);
    }

    @GetMapping("/verify")
    public ResponseEntity<AuthResponse> verify(Authentication authentication) {

        // Extract email from Spring Security context
        String email = authentication.getName();

        AuthResponse response = authService.verify(email);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        String email = authentication.getName();

        authService.changePassword(email, request);
        return ResponseEntity.ok("Password updated successfully");
    }

    @PutMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest forgotPasswordRequest){
        authService.forgotPassword(forgotPasswordRequest);
        return ResponseEntity.ok("Password updated successfully");
    }
    private void setAuthCookie(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie.from(cookieName, token)
                .httpOnly(true)
                .secure(false)              // 🔥 true in production
                .path("/")
                .maxAge(cookieTime)
                .sameSite("Lax")        // or "None" if frontend is on different domain
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }

}