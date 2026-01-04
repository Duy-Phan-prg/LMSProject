package com.Library.lmsproject.mapper;

import com.Library.lmsproject.dto.request.CreateReviewRequestDTO;
import com.Library.lmsproject.dto.response.ReviewResponseDTO;
import com.Library.lmsproject.entity.Review;
import com.Library.lmsproject.entity.Users;
import com.Library.lmsproject.entity.Books;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(target = "reviewId", ignore = true)
    @Mapping(target = "isDeleted", constant = "false")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Review toEntity(CreateReviewRequestDTO dto, Users user, Books book);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.fullName", target = "userName")
    ReviewResponseDTO toResponseDTO(Review review);
}