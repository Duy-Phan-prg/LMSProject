package com.library.lmsproject.service.impl;

import com.library.lmsproject.dto.request.ReportReviewRequestDTO;
import com.library.lmsproject.dto.response.ReportedReviewResponseDTO;
import com.library.lmsproject.entity.ReportStatus;
import com.library.lmsproject.entity.Review;
import com.library.lmsproject.entity.ReviewReport;
import com.library.lmsproject.entity.Users;
import com.library.lmsproject.mapper.ReviewReportMapper;
import com.library.lmsproject.repository.ReviewReportRepository;
import com.library.lmsproject.repository.ReviewRepository;
import com.library.lmsproject.service.ReviewReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewReportServiceImpl implements ReviewReportService {
    private final ReviewRepository reviewRepository;
    private final ReviewReportRepository reviewReportRepository;
    private final ReviewReportMapper reviewReportMapper;


    @Override
    public ReportedReviewResponseDTO reportReview(
            Long reviewId,
            ReportReviewRequestDTO request,
            Users currentUser
    ) {

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (review.isHidden()) {
            throw new RuntimeException("Review was already hidden");
        }

        if (reviewReportRepository.existsByReviewAndReportedBy(review, currentUser)) {
            throw new RuntimeException("Review already reported");
        }

        ReviewReport report = new ReviewReport();
        report.setReview(review);
        report.setReportedBy(currentUser);
        report.setReason(request.getReason());

        report.setStatus(ReportStatus.PENDING);
        report.setCreatedAt(LocalDateTime.now());


        reviewReportRepository.save(report);


        return reviewReportMapper.toResponseDTO(report);
    }


    /**
     * Danh sách review đã bị đánh dấu vi phạm
     */
    @Override
    @Transactional(readOnly = true)
    public List<ReportedReviewResponseDTO> getReportsByStatus(ReportStatus status) {

        return reviewReportRepository.findByStatus(status)
                .stream()
                .map(reviewReportMapper::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional
    public ReportedReviewResponseDTO updateReportStatus(Long reportId, ReportStatus status) {

        ReviewReport report = reviewReportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        if (report.getStatus() != ReportStatus.PENDING) {
            throw new RuntimeException("Report already processed");
        }

        Review review = report.getReview();

        if (status == ReportStatus.VIOLATED) {

            report.setStatus(ReportStatus.VIOLATED);

            // hide review
            review.setHidden(true);

        } else if (status == ReportStatus.IGNORED) {

            report.setStatus(ReportStatus.IGNORED);

            // unhide review
            review.setHidden(false);

        } else {
            throw new RuntimeException("Invalid status");
        }

        // Save both
        reviewRepository.save(review);
        reviewReportRepository.save(report);

        return reviewReportMapper.toResponseDTO(report);
    }







}
