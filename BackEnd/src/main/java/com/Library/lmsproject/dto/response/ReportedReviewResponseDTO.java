package com.Library.lmsproject.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

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
