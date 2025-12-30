package com.Library.lmsproject.controller;

import com.Library.lmsproject.dto.request.UserCreateBorrowRequestDTO;
import com.Library.lmsproject.dto.response.ApiResponse;
import com.Library.lmsproject.dto.response.UserBorrowResponseDTO;
import com.Library.lmsproject.entity.BorrowStatus;
import com.Library.lmsproject.security.CustomUserDetails;
import com.Library.lmsproject.service.BorrowingService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrowings")
@RequiredArgsConstructor
public class BorrowingController {

    private final BorrowingService borrowingService;

    @PostMapping("/createBorrow")
    @Operation(summary = "Tạo yêu cầu mượn sách")
    public ResponseEntity<?> borrowBook(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) Long userId, // nhập trên Swagger
            @Valid @RequestBody UserCreateBorrowRequestDTO request
    ) {
        Long finalUserId;

        if (userDetails != null) {
            finalUserId = userDetails.getId(); // prod
        } else if (userId != null) {
            finalUserId = userId; // dev / swagger
        } else {
            throw new RuntimeException("Không xác định được user");
        }

        return ResponseEntity.ok(
                borrowingService.borrowBook(finalUserId, request)
        );
    }


    @GetMapping("/getAllAndSearchByStatus")
    @Operation(summary = "Admin/Librarian xem tất cả yêu cầu mượn, lọc theo status")
    public ResponseEntity<ApiResponse<List<UserBorrowResponseDTO>>> getAllAndSearchByStatus(
            @RequestParam(required = false) BorrowStatus status
    ) {
        List<UserBorrowResponseDTO> result =
                borrowingService.getAllAndSearchByStatus(status);

        return ResponseEntity.ok(ApiResponse.<List<UserBorrowResponseDTO>>builder()
                .code(200)
                .message("Lấy danh sách thành công")
                .result(result)
                .build());
    }




}