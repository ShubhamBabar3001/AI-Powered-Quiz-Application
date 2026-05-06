package com.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ContestEnrollmentRequest {

    @NotBlank
    private String contestId;
}
