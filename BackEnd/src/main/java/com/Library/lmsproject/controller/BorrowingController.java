package com.Library.lmsproject.controller;

import com.Library.lmsproject.dto.request.UpdateBorrowingStatusRequestDTO;
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
import org.springframework.data.domain.Page;
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

    @PutMapping("/{id}/cancel")
    @Operation(summary = "User hủy yêu cầu mượn sách")
    public ResponseEntity<UserBorrowResponseDTO> cancelBorrowing(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id
    ) {
        UserBorrowResponseDTO response =
                borrowingService.cancelBorrowing(
                        userDetails.getUser().getId(),
                        id
                );

        return ResponseEntity.ok(response);
    }

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
    @GetMapping("/getBorrowingDetails/{borrowingId}")
    @Operation(summary = "Librarian/Admin xem chi tiết yêu cầu mượn sách")
    public ResponseEntity<ApiResponse<LibrarianBorrowResponseDTO>> getBorrowingDetails(
            @PathVariable Long borrowingId
    ) {
        LibrarianBorrowResponseDTO data =
                borrowingService.getBorrowingDetails(borrowingId);

        return ResponseEntity.ok(
                ApiResponse.<LibrarianBorrowResponseDTO>builder()
                        .code(200)
                        .message("Lấy chi tiết yêu cầu mượn sách thành công")
                        .result(data)
                        .build()
        );
    }

    @PutMapping("/borrowings/{borrowingId}/status")
    @Operation(summary = "Librarian cập nhật trạng thái mượn sách (RETURNED / EXPIRED_PICKUP)")
    public ResponseEntity<ApiResponse<LibrarianBorrowResponseDTO>> updateBorrowingStatus(
            @PathVariable Long borrowingId,
            @RequestBody UpdateBorrowingStatusRequestDTO request
    ) {
        LibrarianBorrowResponseDTO result =
                borrowingService.updateStatus(borrowingId, request.getStatus());

        return ResponseEntity.ok(
                ApiResponse.<LibrarianBorrowResponseDTO>builder()
                        .code(200)
                        .message("Cập nhật trạng thái mượn sách thành công")
                        .result(result)
                        .build()
        );
    }


    @Operation(summary = "Admin/Librarian xem tất cả yêu cầu mượn (lọc theo status)")
    @GetMapping("/getAll")
    public Page<LibrarianBorrowResponseDTO> getAllBorrowings(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) BorrowStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return borrowingService.getAllBorrowings(
                keyword,
                status,
                page,
                size
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
