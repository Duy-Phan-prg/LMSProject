package com.library.lmsproject.controller;

import com.library.lmsproject.dto.request.CreateReviewRequestDTO;
import com.library.lmsproject.dto.request.UpdateReviewRequestDTO;
import com.library.lmsproject.dto.response.ReviewResponseDTO;
import com.library.lmsproject.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;


    @Operation(
            summary = "Create review",
            description = "User must borrow and return the book before reviewing. Each user can review a book only once."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Review created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request or business rule violated"),
            @ApiResponse(responseCode = "404", description = "User or Book not found")
    })
    @PostMapping("/createReview")
    public ResponseEntity<ReviewResponseDTO> createReview(
            @RequestBody CreateReviewRequestDTO request,
            @RequestParam Long userId
    ) {
        return ResponseEntity.ok(
                reviewService.createReview(request, userId)
        );
    }

    @Operation(
            summary = "Get reviews by book và user có thể coi review chính mình trên đó ",
            description = "Get all non-deleted reviews of a specific book"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "404", description = "Book not found")
    })
    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsByBook(
            @PathVariable Long bookId
    ) {
        return ResponseEntity.ok(
                reviewService.getReviewsByBook(bookId)
        );
    }

    @Operation(
            summary = "Delete review",
            description = "Only the owner of the review can delete it (soft delete)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Review deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Not allowed to delete this review"),
            @ApiResponse(responseCode = "404", description = "Review not found")
    })
    @DeleteMapping("/deleteReview/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id,
            @RequestParam Long userId
    ) {
        reviewService.deleteReview(id, userId);
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Update review",
            description = "Only the owner can update a review and it can be edited only once"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Review updated successfully"),
            @ApiResponse(responseCode = "403", description = "Not allowed or already edited"),
            @ApiResponse(responseCode = "404", description = "Review not found")
    })
    @PutMapping("/updateReview/{reviewId}")
    public ResponseEntity<ReviewResponseDTO> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody UpdateReviewRequestDTO request,
            @RequestParam Long userId
    ) {
        return ResponseEntity.ok(
                reviewService.updateReview(reviewId, request, userId)
        );
    }

    @Operation(
            summary = "Get all reviews",
            description = "Get all non-deleted reviews (admin or public view)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success")
    })
    @GetMapping("/getAllReviews")
    public ResponseEntity<List<ReviewResponseDTO>> getAllReviews() {
        return ResponseEntity.ok(
                reviewService.getAllReviews()
        );
    }
}


