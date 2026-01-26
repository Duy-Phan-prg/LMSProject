package com.library.lmsproject.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportedReviewResponseDTO {
    private Long reviewId;

    private Long bookId;
    private String isbn;
    private String bookTitle;

    private String reviewContent;
    private Integer rating;

    private String reportedBy;
    private String reason;

    private Boolean isViolated;
    private LocalDateTime reportedAt;
}
