package com.library.lmsproject.mapper;

import com.library.lmsproject.dto.response.ReportedReviewResponseDTO;
import com.library.lmsproject.entity.ReviewReport;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewReportMapper {
    @Mapping(target = "reviewId", source = "review.reviewId")

    @Mapping(target = "bookId", source = "review.book.bookId")
    @Mapping(target = "isbn", source = "review.book.isbn")
    @Mapping(target = "bookTitle", source = "review.book.title")

    @Mapping(target = "reviewContent", source = "review.comment")
    @Mapping(target = "rating", source = "review.rating")

    @Mapping(target = "reportedBy", source = "reportedBy.fullName")
    @Mapping(target = "reason", source = "reason")
    @Mapping(target = "isViolated", source = "isViolated")
    @Mapping(target = "reportedAt", source = "createdAt")


    ReportedReviewResponseDTO toResponseDTO(ReviewReport report);
}
