package com.project.service;

import com.project.dto.request.SaveQuizRequest;
import com.project.dto.response.QuestionResponse;
import com.project.dto.response.QuizResponse;
import com.project.entity.Question;
import com.project.entity.Quiz;
import com.project.entity.QuizAttempt;
import com.project.entity.User;
import com.project.exception.CustomException;
import com.project.mapper.QuizMapper;
import com.project.repository.AttemptRepository;
import com.project.repository.QuestionRepository;
import com.project.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final AttemptRepository attemptRepository;
    private final UserService userService;
    private final QuizMapper quizMapper;

    @Cacheable(value = "quizzes", key = "#id")
    public QuizResponse getQuiz(String id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new CustomException("Quiz not found"));
        return quizMapper.toResponse(quiz);
    }

    public List<QuizResponse> getAllQuizzes() {
        return quizRepository.findAll().stream()
                .map(quizMapper::toResponse)
                .collect(Collectors.toList());
    }
    public List<QuizResponse> getQuizzesByCategory(String type){
        return quizRepository.findByType(type).stream()
                .map(quizMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<QuestionResponse> startQuiz(String quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new CustomException("Quiz not found"));
        List<String> questionIds = quiz.getQuestions();
        if (questionIds == null || questionIds.isEmpty()) {
            throw new CustomException("Quiz has no questions configured");
        }
        List<QuestionResponse> questions = questionIds.stream()
                .map(qId -> questionRepository.findById(qId)
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
    @Transactional
    public Quiz addQuiz(SaveQuizRequest quizRequest){
        if(quizRequest==null) return null;
        Quiz newQuiz = new Quiz();
        newQuiz.setTitle(quizRequest.getTitle());
        newQuiz.setType(quizRequest.getType());
        newQuiz.setCategory(quizRequest.getCategory());
        newQuiz.setDifficulty(quizRequest.getDifficulty());
        newQuiz.setDescription(quizRequest.getDescription());
        newQuiz.setTimeLimit(quizRequest.getTimeLimit());

        List<SaveQuizRequest.TempQuestion> tempQuestions = quizRequest.getQuestions();

        for(SaveQuizRequest.TempQuestion question :tempQuestions){
            Question newQuestion = new Question();
            newQuestion.setType(question.getType());
            newQuestion.setText(question.getText());
            newQuestion.setOptions(question.getOptions());
            newQuestion.setCorrectAnswer(question.getCorrectAnswer());
            newQuestion.setExplanation(question.getExplanation());
            Question savedQuestion = questionRepository.save(newQuestion);  // Save Question first
//            System.out.println("LOG: "+savedQuestion.getId());
            newQuiz.getQuestions().add(savedQuestion.getId());
        }
        quizRepository.save(newQuiz);
        return newQuiz;
    }

    public QuizAttempt submitQuiz(String quizId, String userEmail, Map<String, List<String>> answers, Integer timeLeft) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new CustomException("Quiz not found"));
        User user = userService.getUserByEmail(userEmail);

        AtomicInteger correct = new AtomicInteger(0);
        // Compare answers with correct answers in quiz
        answers.forEach((id,options)->{
            Optional<Question> que = questionRepository.findById(id);
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
        return attempt;
    }
}