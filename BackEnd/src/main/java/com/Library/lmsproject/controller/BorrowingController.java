package com.Library.lmsproject.controller;

import com.Library.lmsproject.dto.request.UserCreateBorrowRequestDTO;
import com.Library.lmsproject.dto.response.ApiResponse;
import com.Library.lmsproject.dto.response.LibrarianBorrowResponseDTO;
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

    // ================= USER =================

    @PostMapping("/create")
    @Operation(summary = "User tạo yêu cầu mượn sách")
    public ResponseEntity<UserBorrowResponseDTO> borrowBook(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) Long userId, // dùng cho Swagger
            @Valid @RequestBody UserCreateBorrowRequestDTO request
    ) {

        Long finalUserId;

        if (userDetails != null) {
            finalUserId = userDetails.getId();
        } else if (userId != null) {
            finalUserId = userId;
        } else {
            throw new RuntimeException("Không xác định được user");
        }

        return ResponseEntity.ok(
                borrowingService.borrowBook(finalUserId, request)
        );
    }

    @GetMapping("/me")
    @Operation(summary = "User xem danh sách mượn của mình (lọc theo status)")
    public ResponseEntity<ApiResponse<List<UserBorrowResponseDTO>>> getMyBorrowings(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) BorrowStatus status
    ) {
        if (userDetails == null) {
            throw new RuntimeException("Bạn chưa đăng nhập");
        }

        List<UserBorrowResponseDTO> result =
                borrowingService.getMyBorrowings(
                        userDetails.getId(),
                        status
                );

        return ResponseEntity.ok(
                ApiResponse.<List<UserBorrowResponseDTO>>builder()
                        .code(200)
                        .message("Lấy danh sách mượn của bạn thành công")
                        .result(result)
                        .build()
        );
    }

    // ================= ADMIN / LIBRARIAN =================

    @GetMapping
    @Operation(summary = "Admin/Librarian xem tất cả yêu cầu mượn (lọc theo status)")
    public ResponseEntity<ApiResponse<List<LibrarianBorrowResponseDTO>>> getAllBorrowings(
            @RequestParam(required = false) BorrowStatus status
    ) {

        List<LibrarianBorrowResponseDTO> result =
                borrowingService.getAllBorrowings(status);

        return ResponseEntity.ok(
                ApiResponse.<List<LibrarianBorrowResponseDTO>>builder()
                        .code(200)
                        .message("Lấy danh sách mượn thành công")
                        .result(result)
                        .build()
        );
    }

    @PutMapping("/{borrowingId}/pickup")
    @Operation(summary = "Librarian giao sách cho user")
    public ResponseEntity<ApiResponse<String>> pickupBook(
            @PathVariable Long borrowingId,
            @RequestParam Integer borrowDays
    ) {

        borrowingService.pickupBook(borrowingId, borrowDays);

        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                        .code(200)
                        .message("Giao sách thành công")
                        .result("Pickup success")
                        .build()
        );
    }
}
