package com.project.repository;

import com.project.entity.Contest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContestRepository extends MongoRepository<Contest, String> {
    List<Contest> findByStatus(String status);
    List<Contest> findByParticipantsContaining(String userId);
}
