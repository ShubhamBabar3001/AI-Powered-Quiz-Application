package com.project.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import com.project.dto.response.QuestionResponse;
import com.project.entity.*;
import com.project.exception.CustomException;
import com.project.repository.AiQuestionRepository;
import com.project.repository.AiQuizRepository;
import com.project.repository.AttemptRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
public class GeminiService {

    private final Client geminiClient;
    private final ObjectMapper objectMapper;
    private final GenerateContentConfig config;
    private final UserService userService;
    private final AiQuizRepository aiQuizRepository;
    private final AttemptRepository attemptRepository;
    private final AiQuestionRepository aiQuestionRepository;




    @Value("${gemini.api.model}")
    private String model;

    public GeminiService(Client geminiClient, ObjectMapper objectMapper, UserService userService, AiQuizRepository aiQuizRepository, AttemptRepository attemptRepository, AiQuestionRepository aiQuestionRepository) {
        this.geminiClient = geminiClient;
        this.objectMapper = objectMapper;
        this.userService = userService;
        this.aiQuizRepository = aiQuizRepository;
        this.attemptRepository = attemptRepository;
        this.aiQuestionRepository = aiQuestionRepository;
        this.config =  GenerateContentConfig.builder()
                .responseMimeType("application/json")
                .build();
    }

    public AiQuiz generateQuestions(String topic,String difficulty, int count,int timeLimit) {
        String prompt = buildPrompt(topic, difficulty, count);

        try {

            GenerateContentResponse response = geminiClient.models.generateContent(
                    model,
                    Content.fromParts(Part.fromText(prompt)),
                    config
            );

            String jsonResponse = response.text();


            String cleanJson = cleanJsonResponse(jsonResponse);
            List<Question> questions = objectMapper.readValue(
                    cleanJson,
                    new TypeReference<List<Question>>() {}
            );

            // Save quiz first
            AiQuiz quiz = new AiQuiz();
            quiz.setTitle(topic);
            quiz.setDifficulty(difficulty);
            quiz.setTimeLimit(timeLimit);
            quiz.setCreatedAt(LocalDateTime.now());
            quiz.setUpdatedAt(LocalDateTime.now());

            quiz = aiQuizRepository.save(quiz);

            // Save all generated questions
            List<String> questionIds = new ArrayList<>();

            for (Question question : questions) {

                AiQuizQuestions dbQuestion = new AiQuizQuestions();
                dbQuestion.setText(question.getText());
                dbQuestion.setType(question.getType());
                dbQuestion.setOptions(question.getOptions());
                dbQuestion.setCorrectAnswer(question.getCorrectAnswer());
                dbQuestion.setExplanation(question.getExplanation());

                dbQuestion = aiQuestionRepository.save(dbQuestion);

                questionIds.add(dbQuestion.getId());
            }

            // Update quiz with question ids
            quiz.setQuestions(questionIds);
            quiz.setUpdatedAt(LocalDateTime.now());

            return aiQuizRepository.save(quiz);

        } catch (Exception e) {
            log.error("Error generating questions from Gemini: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate questions from Gemini AI", e);
        }
    }

    private String buildPrompt(String topic, String difficulty, int count) {
        return String.format("""
            Generate %d quiz questions about "%s".
            
            Requirements:
            - Difficulty: %s
            - Return ONLY a valid JSON array, no markdown, no explanation.
            - Automatically decide whether each question should be SINGLE or MULTIPLE based on what fits naturally.
            
            Each question must strictly follow this JSON structure:
            {
              "text": "The question text here",
              "type": "SINGLE or MULTIPLE",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "correctAnswer": ["Option A"],
              "explanation": "Brief explanation of why this is correct"
            }
            
            Rules:
            - "options" must always have exactly 4 items.
            - Use "SINGLE" when only one answer is correct.
            - Use "MULTIPLE" when two or more answers are correct.
            - For SINGLE type: "correctAnswer" must contain exactly 1 item.
            - For MULTIPLE type: "correctAnswer" must contain 2 or more items.
            - "correctAnswer" values must exactly match strings from "options".
            - Mix SINGLE and MULTIPLE questions naturally where appropriate.
            - Do NOT include "id" field, it will be auto-generated.
            - Return a JSON array of %d question objects only.
            """,
                count, topic, difficulty, count
        );
    }
    public String generateContest(String prompt){
        GenerateContentResponse response = geminiClient.models.generateContent(
                model,
                Content.fromParts(Part.fromText(prompt)),
                config
        );

        return response.text();
    }

    private String cleanJsonResponse(String response) {
        if (response == null) return "[]";
        String cleaned = response.trim();
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.substring(7);
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.substring(3);
        }
        if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length() - 3);
        }
        return cleaned.trim();
    }
    public List<QuestionResponse> startQuiz(String quizId) {
        AiQuiz quiz = aiQuizRepository.findById(quizId)
                .orElseThrow(() -> new CustomException("Quiz not found"));
        List<String> questionIds = quiz.getQuestions();
        if (questionIds == null || questionIds.isEmpty()) {
            throw new CustomException("Quiz has no questions configured");
        }
        List<QuestionResponse> questions = questionIds.stream()
                .map(qId -> aiQuestionRepository.findById(qId)
                        .orElseThrow(() ->
                                new CustomException("Question not found with id: " + qId)))
                .map(question -> {
                    QuestionResponse response = new QuestionResponse();
                    response.setId(question.getId());
                    response.setText(question.getText());
                    response.setType(question.getType());
                    response.setOptions(question.getOptions());
                    return response;
                })
                .toList();

        return questions;
    }
    public QuizAttempt submitQuiz(String quizId, String userEmail, Map<String, List<String>> answers, Integer timeLeft) {
        AiQuiz quiz = aiQuizRepository.findById(quizId)
                .orElseThrow(() -> new CustomException("Quiz not found"));
        User user = userService.getUserByEmail(userEmail);

        AtomicInteger correct = new AtomicInteger(0);
        // Compare answers with correct answers in quiz
        answers.forEach((id,options)->{
            Optional<AiQuizQuestions> que = aiQuestionRepository.findById(id);
            if(que.isEmpty()) throw new CustomException("Question Not found");
            if(options.equals(que.get().getCorrectAnswer())){
                correct.incrementAndGet();
            }
        });


        int score = (correct.get() * 100) / quiz.getQuestions().size();
        int timeSpent = (quiz.getTimeLimit() * 60)-timeLeft;
        QuizAttempt attempt = QuizAttempt.builder()
                .quizName(quiz.getTitle())
                .userId(user.getId())
                .date(LocalDateTime.now().toString())
                .score(score)
                .correctAnswers(correct.get())
                .totalQuestions(quiz.getQuestions().size())
                .timeSpent(timeSpent) // Placeholder
                .build();

        attemptRepository.save(attempt);
        deleteQuizAndQuestions(quizId);
        return attempt;
    }
    private void deleteQuizAndQuestions(String quizId){
        AiQuiz quiz = aiQuizRepository.findById(quizId)
                .orElseThrow(() -> new CustomException("Quiz not found"));
        for(String i: quiz.getQuestions()){
            aiQuestionRepository.deleteById(i);
        }
        aiQuizRepository.deleteById(quizId);
    }
}