package com.library.lmsproject.service;

import com.library.lmsproject.dto.request.ReportReviewRequestDTO;
import com.library.lmsproject.dto.response.ReportedReviewResponseDTO;
import com.library.lmsproject.entity.ReportStatus;
import com.library.lmsproject.entity.Users;

import java.util.List;

public interface ReviewReportService {
    ReportedReviewResponseDTO reportReview(
            Long reviewId,
            ReportReviewRequestDTO request,
            Users admin
    );
    List<ReportedReviewResponseDTO> getReportsByStatus(ReportStatus status);
    ReportedReviewResponseDTO updateReportStatus(Long reportId, ReportStatus status);
    List<ReportedReviewResponseDTO> getAllReports();


}
