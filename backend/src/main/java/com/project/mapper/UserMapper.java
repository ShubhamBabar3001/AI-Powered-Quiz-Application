package com.project.mapper;

import com.project.dto.request.SignupRequest;
import com.project.dto.response.UserProfileResponse;
import com.project.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "totalScore", ignore = true)
    @Mapping(target = "quizzesAttempted", ignore = true)
    @Mapping(target = "rank", ignore = true)
    @Mapping(target = "streak", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User toEntity(SignupRequest request);

    UserProfileResponse toProfileResponse(User user);
}
