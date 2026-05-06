package com.project.repository;

import com.project.entity.AiQuiz;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AiQuizRepository extends MongoRepository<AiQuiz, String> {
}
