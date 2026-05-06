package com.project.service;

import com.project.dto.request.ContestCreateRequest;
import com.project.dto.request.ContestEnrollmentRequest;
import com.project.dto.response.ContestResponse;
import com.project.entity.Contest;
import com.project.entity.User;
import com.project.exception.CustomException;
import com.project.mapper.ContestMapper;
import com.project.repository.ContestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContestService {

    private final ContestRepository contestRepository;
    private final ContestMapper contestMapper;
    private final UserService userService;

    @CacheEvict(value = "contests", allEntries = true)
    public ContestResponse addContest(ContestCreateRequest request) {
        Contest contest = contestMapper.toEntity(request);
        Contest saved = contestRepository.save(contest);
        return contestMapper.toResponse(saved);
    }

    @Cacheable(value = "contests")
    public List<ContestResponse> getAllContests() {
        return contestRepository.findAll().stream()
                .map(contestMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "contest", key = "#id")
    public ContestResponse getContest(String id) {
        Contest contest = contestRepository.findById(id)
                .orElseThrow(() -> new CustomException("Contest not found"));
        return contestMapper.toResponse(contest);
    }

    @CacheEvict(value = "contests", allEntries = true)
    public Contest enrollInContest(String userEmail, String contestId) {
        User user = userService.getUserByEmail(userEmail);
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new CustomException("Contest not found"));

        if (contest.getDeadline().isBefore(LocalDateTime.now())) {
            throw new CustomException("Contest deadline has passed");
        }

        if (contest.getParticipants()!=null && contest.getParticipants().contains(user.getId())) {
            throw new CustomException("Already enrolled");
        }
        contest.getParticipants().add(user.getId());
        return contestRepository.save(contest);
    }
}
