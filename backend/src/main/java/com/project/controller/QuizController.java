package com.project.controller;

import com.project.dto.request.SaveQuizRequest;
import com.project.dto.response.QuestionResponse;
import com.project.dto.response.QuizResponse;
import com.project.entity.Quiz;
import com.project.entity.QuizAttempt;
import com.project.service.QuizService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    // ✅ GET QUIZ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<QuizResponse> getQuiz(
            @PathVariable @NotBlank String id
    ) {
        return ResponseEntity.ok(quizService.getQuiz(id));
    }

    // ✅ GET ALL QUIZZES
    @GetMapping
    public ResponseEntity<List<QuizResponse>> getAllQuizzes() {
        return ResponseEntity.ok(quizService.getAllQuizzes());
    }

    // ✅ GET BY CATEGORY / TYPE
    @GetMapping("/category/{type}")
    public ResponseEntity<List<QuizResponse>> getByCategory(
            @PathVariable String type
    ) {
        return ResponseEntity.ok(quizService.getQuizzesByCategory(type));
    }

    // ✅ START QUIZ (NO CORRECT ANSWERS)
    @PostMapping("/start")
    public ResponseEntity<List<QuestionResponse>> startQuiz(
            @RequestParam String quizId
    ) {
        return ResponseEntity.ok(quizService.startQuiz(quizId));
    }

    // ✅ CREATE QUIZ (ADMIN USE)
    @PostMapping
    public ResponseEntity<Quiz> createQuiz(
            @Valid @RequestBody SaveQuizRequest request
    ) {
        Quiz quiz = quizService.addQuiz(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(quiz);
    }

    // ✅ SUBMIT QUIZ
    @PostMapping("/submit")
    public ResponseEntity<QuizAttempt> submitQuiz(
            @RequestParam String quizId,
            @RequestParam Integer timeLeft,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, List<String>> answers
    ) {

        String userEmail = userDetails.getUsername(); // assuming email = username

        QuizAttempt attempt = quizService.submitQuiz(
                quizId,
                userEmail,
                answers,
                timeLeft
        );

        return ResponseEntity.ok(attempt);
    }
}