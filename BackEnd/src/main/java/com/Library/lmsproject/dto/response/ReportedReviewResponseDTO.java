package com.library.lmsproject.dto.response;

import com.library.lmsproject.entity.ReportStatus;
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
    private Long reportId;
    private Long reviewId;

    private Long bookId;
    private String isbn;
    private String bookTitle;

    private String reviewContent;
    private Integer rating;

    private String reviewAuthor;

    private String reportedBy;
    private String reason;

    private ReportStatus status;

    private LocalDateTime reportedAt;
}
