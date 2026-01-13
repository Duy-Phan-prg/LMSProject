package com.Library.lmsproject.service;

import com.Library.lmsproject.dto.request.ReportReviewRequestDTO;
import com.Library.lmsproject.dto.response.ReportedReviewResponseDTO;
import com.Library.lmsproject.entity.Users;

import java.util.List;

public interface ReviewReportService {
    ReportedReviewResponseDTO reportReview(
            Long reviewId,
            ReportReviewRequestDTO request,
            Users admin
    );

    List<ReportedReviewResponseDTO> getViolatedReviews();
}
