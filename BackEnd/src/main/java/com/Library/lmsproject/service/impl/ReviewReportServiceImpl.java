package com.Library.lmsproject.service.impl;

import com.Library.lmsproject.dto.request.ReportReviewRequestDTO;
import com.Library.lmsproject.dto.response.ReportedReviewResponseDTO;
import com.Library.lmsproject.entity.Review;
import com.Library.lmsproject.entity.ReviewReport;
import com.Library.lmsproject.entity.Users;
import com.Library.lmsproject.mapper.ReviewReportMapper;
import com.Library.lmsproject.repository.ReviewReportRepository;
import com.Library.lmsproject.repository.ReviewRepository;
import com.Library.lmsproject.service.ReviewReportService;
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
            Users moderator
    ) {
        // 1. Lấy review
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // 2. Check đã bị report chưa
        if (reviewReportRepository.existsByReview(review)) {
            throw new RuntimeException("Review already marked as violated");
        }

        // 3. Ẩn (soft delete) review
        review.setIsDeleted(true);

        // 4. Tạo report
        ReviewReport report = new ReviewReport();
        report.setReview(review);
        report.setReportedBy(moderator);
        report.setReason(request.getReason());
        report.setIsViolated(true);
        report.setCreatedAt(LocalDateTime.now());

        // 5. Lưu
        reviewReportRepository.save(report);

        // 6. Trả response DTO
        return reviewReportMapper.toResponseDTO(report);
    }

    /**
     * Danh sách review đã bị đánh dấu vi phạm
     */
    @Override
    @Transactional(readOnly = true)
    public List<ReportedReviewResponseDTO> getViolatedReviews() {

        return reviewReportRepository.findAll()
                .stream()
                .map(reviewReportMapper::toResponseDTO)
                .toList();
    }

}
