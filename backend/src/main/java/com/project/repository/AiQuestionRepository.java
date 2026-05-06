package com.project.repository;

import com.project.entity.AiQuizQuestions;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AiQuestionRepository extends MongoRepository<AiQuizQuestions, String> {
}
