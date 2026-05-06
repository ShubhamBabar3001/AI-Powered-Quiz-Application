package com.project.service;

import com.project.constants.OtpPurpose;
import com.project.dto.request.SendOtpRequest;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(SendOtpRequest sendOtpRequest ,String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(sendOtpRequest.getEmail());
            helper.setSubject(getSubject(sendOtpRequest.getPurpose()));
            helper.setText(getBody(otp, sendOtpRequest.getPurpose()), false);

            mailSender.send(message);

        } catch (MessagingException e) {
            log.error("Failed to send OTP email to {}", sendOtpRequest.getEmail(), e);
            throw new RuntimeException("Failed to send OTP email");
        }
    }

    private String getSubject(OtpPurpose purpose) {
        return switch (purpose) {
            case SIGNUP -> "OTP for Account Registration";
            case FORGOT_PASSWORD -> "OTP for Password Reset";
        };
    }

    private String getBody(String otp, OtpPurpose purpose) {
        return switch (purpose) {
            case SIGNUP ->
                    "Welcome to Quiz AI Platform.\n\nYour OTP is: " + otp +
                            "\nIt expires in 5 minutes.";

            case FORGOT_PASSWORD ->
                    "You requested password reset.\n\nYour OTP is: " + otp +
                            "\nIt expires in 5 minutes.\nIf not requested, ignore this email.";
        };
    }
}