package com.Library.lmsproject.controller;

import com.Library.lmsproject.dto.request.CreateReviewRequestDTO;
import com.Library.lmsproject.dto.response.ReviewResponseDTO;
import com.Library.lmsproject.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponseDTO> createReview(
            @RequestBody CreateReviewRequestDTO request,
            @RequestParam Long userId
    ) {
        return ResponseEntity.ok(
                reviewService.createReview(request, userId)
        );
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsByBook(
            @PathVariable Long bookId
    ) {
        return ResponseEntity.ok(
                reviewService.getReviewsByBook(bookId)
        );
    }
}
