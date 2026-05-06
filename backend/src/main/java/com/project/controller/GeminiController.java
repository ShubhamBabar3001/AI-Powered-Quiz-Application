package com.project.controller;

import com.project.dto.request.GenerateQuestionsRequest;
import com.project.dto.request.TempRequest;
import com.project.dto.response.QuestionResponse;
import com.project.entity.AiQuiz;
import com.project.entity.QuizAttempt;
import com.project.service.GeminiService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class GeminiController {

    private final GeminiService geminiService;

    public GeminiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/questions/generate")
    public ResponseEntity<AiQuiz> generateQuestions(
            @Valid @RequestBody GenerateQuestionsRequest request
    ) {

         AiQuiz res = geminiService.generateQuestions(
                request.topic(),
                request.difficulty().toUpperCase(),
                request.count(),
                request.timeLimit()

        );

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }
    @PostMapping("/prompt")
    public ResponseEntity<String> generateContest(@RequestBody TempRequest prompt){
       String answer = geminiService.generateContest(prompt.getPrompt());
       return ResponseEntity.ok(answer);
    }
    @PostMapping("/quizzes/start")
    public ResponseEntity<List<QuestionResponse>> startQuiz(
            @RequestParam String quizId
    ) {
        return ResponseEntity.ok(geminiService.startQuiz(quizId));
    }
    @PostMapping("/quizzes/submit")
    public ResponseEntity<QuizAttempt> submitQuiz(
            @RequestParam String quizId,
            @RequestParam Integer timeLeft,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, List<String>> answers
    ) {

        String userEmail = userDetails.getUsername(); // assuming email = username

        QuizAttempt attempt = geminiService.submitQuiz(
                quizId,
                userEmail,
                answers,
                timeLeft
        );

        return ResponseEntity.ok(attempt);
    }

}
