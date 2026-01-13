package com.Library.lmsproject.controller;

import com.Library.lmsproject.dto.request.ReportReviewRequestDTO;
import com.Library.lmsproject.dto.response.ReportedReviewResponseDTO;
import com.Library.lmsproject.entity.Users;
import com.Library.lmsproject.security.CustomUserDetails;
import com.Library.lmsproject.service.ReviewReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/reviews")
public class AdminReviewController {
    private final ReviewReportService reviewReportService;

    @GetMapping("/violated")
    public ResponseEntity<List<ReportedReviewResponseDTO>> getViolatedReviews() {
        return ResponseEntity.ok(reviewReportService.getViolatedReviews());
    }

    @PostMapping("/{reviewId}/report")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    public ResponseEntity<ReportedReviewResponseDTO> reportReview(
            @PathVariable Long reviewId,
            @RequestBody ReportReviewRequestDTO request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Users moderator = userDetails.getUser();

        return ResponseEntity.ok(
                reviewReportService.reportReview(reviewId, request, moderator)
        );
    }
}
