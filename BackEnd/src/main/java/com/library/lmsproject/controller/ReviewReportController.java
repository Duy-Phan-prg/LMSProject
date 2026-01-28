package com.library.lmsproject.controller;

import com.library.lmsproject.dto.request.ReportReviewRequestDTO;
import com.library.lmsproject.dto.response.ReportedReviewResponseDTO;
import com.library.lmsproject.entity.Users;
import com.library.lmsproject.security.CustomUserDetails;
import com.library.lmsproject.service.ReviewReportService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
public class ReviewReportController {
    private final ReviewReportService reviewReportService;

    @GetMapping("/violated")
    public ResponseEntity<List<ReportedReviewResponseDTO>> getViolatedReviews() {
        return ResponseEntity.ok(reviewReportService.getViolatedReviews());
    }

    @PostMapping("/{reviewId}/report")
    @Operation(summary = "User sẽ report bài review của user khác khi thấy nội dung không phù hợp")
    public ResponseEntity<ReportedReviewResponseDTO> reportReview(
            @PathVariable Long reviewId,
            @RequestBody ReportReviewRequestDTO request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        if (userDetails == null) {
            throw new RuntimeException("You must login to report review");
        }

        Users reporter = userDetails.getUser();

        return ResponseEntity.ok(
                reviewReportService.reportReview(reviewId, request, reporter)
        );
    }

}
