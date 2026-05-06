package com.project.mapper;

import com.project.dto.response.QuizResponse;
import com.project.entity.Quiz;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface QuizMapper {
    @Mapping(target = "questionsSize", expression = "java(quiz.getQuestions() != null ? quiz.getQuestions().size() : 0)")
    QuizResponse toResponse(Quiz quiz);
}