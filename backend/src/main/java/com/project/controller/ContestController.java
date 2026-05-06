package com.project.controller;

import com.project.dto.request.ContestCreateRequest;
import com.project.dto.request.ContestEnrollmentRequest;
import com.project.dto.response.ContestResponse;
import com.project.entity.Contest;
import com.project.service.ContestService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contests")
@RequiredArgsConstructor
@Validated
public class ContestController {

    private final ContestService contestService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ContestResponse> createContest(
            @Valid @RequestBody ContestCreateRequest request
    ) {
        ContestResponse response = contestService.addContest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ContestResponse>> getAllContests() {
        return ResponseEntity.ok(contestService.getAllContests());
    }

    @GetMapping("/{contestId}")
    public ResponseEntity<ContestResponse> getContest(
            @PathVariable @NotBlank String contestId
    ) {
        return ResponseEntity.ok(contestService.getContest(contestId));
    }

    @PostMapping("/enroll/{contestId}")
    public ResponseEntity<Contest> enrollInContest(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String contestId
    ) {
        String userEmail = userDetails.getUsername();
        Contest contest =contestService.enrollInContest(userEmail, contestId);
        return ResponseEntity.ok(contest);
    }
}