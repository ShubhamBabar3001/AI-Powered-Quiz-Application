package com.project.service;

import com.project.dto.request.OtpVerificationRequest;
import com.project.dto.request.SendOtpRequest;
import com.project.exception.CustomException;
import com.project.util.OtpGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;


@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final StringRedisTemplate redisTemplate;
    private final MailService mailService;
    private static final String OTP_PREFIX = "otp:";
    private static final long OTP_EXPIRY_MINUTES = 5;

    public void sendOtp(SendOtpRequest sendOtpRequest) {
        String otp = OtpGenerator.generate();
        String key = OTP_PREFIX + sendOtpRequest.getEmail();
        redisTemplate.opsForValue().set(key, otp, Duration.ofMinutes(OTP_EXPIRY_MINUTES));
        mailService.sendOtpEmail(sendOtpRequest, otp);
//        log.info("OTP sent to {}", sendOtpRequest.getEmail());
    }

    public boolean verifyOtp(OtpVerificationRequest request) {
        String key = OTP_PREFIX + request.getEmail();
        String storedOtp = redisTemplate.opsForValue().get(key);
        if (storedOtp == null) {
            throw new CustomException("OTP expired or not found");
        }
        if (!storedOtp.equals(request.getOtp())) {
            throw new CustomException("Invalid OTP");
        }
        redisTemplate.delete(key);
        return true;
    }
}
