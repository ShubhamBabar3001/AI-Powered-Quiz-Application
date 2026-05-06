package com.project.mapper;

import com.project.dto.request.ContestCreateRequest;
import com.project.dto.response.ContestResponse;
import com.project.entity.Contest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ContestMapper {
    ContestResponse toResponse(Contest contest);
    public Contest toEntity(ContestCreateRequest request);
}