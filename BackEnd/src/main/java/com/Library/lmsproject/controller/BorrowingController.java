package com.Library.lmsproject.controller;

import com.Library.lmsproject.dto.request.UserCreateBorrowRequestDTO;
import com.Library.lmsproject.dto.response.ApiResponse;
import com.Library.lmsproject.dto.response.LibrarianBorrowResponseDTO;
import com.Library.lmsproject.dto.response.UserBorrowResponseDTO;
import com.Library.lmsproject.security.CustomUserDetails;
import com.Library.lmsproject.service.BorrowingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrowings")
@RequiredArgsConstructor
@Tag(name = "Quản lý mượn sách", description = "APIs quản lý việc mượn/trả sách")
public class BorrowingController {

    private final BorrowingService borrowingService;

    @PostMapping("/createBorrow")
    @Operation(summary = "Tạo yêu cầu mượn sách")
    public ResponseEntity<ApiResponse<UserBorrowResponseDTO>> borrowBook(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UserCreateBorrowRequestDTO request
    ) {
        // Dùng userId từ user đang đăng nhập thay vì nhận từ param
        Long userId = userDetails.getId();
        UserBorrowResponseDTO response = borrowingService.borrowBook(userId, request);

        return ResponseEntity.ok(ApiResponse.<UserBorrowResponseDTO>builder()
                .code(200)
                .message("Tạo yêu cầu mượn sách thành công")
                .result(response)
                .build());
    }

    @GetMapping("/getAll")
    @Operation(summary = "Lấy danh sách yêu cầu mượn của user hiện tại")
    public ResponseEntity<ApiResponse<List<UserBorrowResponseDTO>>> getAllUserBorrowings(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getId();
        List<UserBorrowResponseDTO> list = borrowingService.getAllUserBorrowings(userId);

        return ResponseEntity.ok(ApiResponse.<List<UserBorrowResponseDTO>>builder()
                .code(200)
                .message("Lấy danh sách thành công")
                .result(list)
                .build());
    }

    @GetMapping("/getAllPending")
    @PreAuthorize("hasRole('LIBRARIAN')") // Chỉ librarian mới được xem
    @Operation(summary = "Lấy tất cả yêu cầu mượn đang chờ duyệt (LIBRARIAN)")
    public ResponseEntity<ApiResponse<List<LibrarianBorrowResponseDTO>>> getAllPending() {
        List<LibrarianBorrowResponseDTO> pendingList = borrowingService.getAllPending();

        return ResponseEntity.ok(ApiResponse.<List<LibrarianBorrowResponseDTO>>builder()
                .code(200)
                .message("Lấy danh sách pending thành công")
                .result(pendingList)
                .build());
    }

    @GetMapping("/getAllActive")
    @PreAuthorize("hasRole('LIBRARIAN')") // Chỉ librarian mới được xem
    @Operation(summary = "Lấy danh sách mượn đang active (LIBRARIAN)")
    public ResponseEntity<ApiResponse<List<LibrarianBorrowResponseDTO>>> getAllActive() {
        List<LibrarianBorrowResponseDTO> result = borrowingService.getAllActive();

        return ResponseEntity.ok(ApiResponse.<List<LibrarianBorrowResponseDTO>>builder()
                .code(200)
                .message("Lấy danh sách mượn đang active thành công")
                .result(result)
                .build());
    }
    @GetMapping("/getAllOverdue")
    @PreAuthorize("hasRole('LIBRARIAN')")
    @Operation(summary = "Lấy danh sách sách quá hạn (LIBRARIAN)")
    public ResponseEntity<ApiResponse<List<LibrarianBorrowResponseDTO>>> getAllOverdue() {
        List<LibrarianBorrowResponseDTO> result = borrowingService.getAllOverdue();

        return ResponseEntity.ok(ApiResponse.<List<LibrarianBorrowResponseDTO>>builder()
                .code(200)
                .message("Lấy danh sách sách quá hạn thành công")
                .result(result)
                .build());
    }

    @GetMapping("/getAllReturned")
    @PreAuthorize("hasRole('LIBRARIAN')")
    @Operation(summary = "Lấy danh sách sách đã trả (LIBRARIAN)")
    public ResponseEntity<ApiResponse<List<LibrarianBorrowResponseDTO>>> getAllReturned() {
        List<LibrarianBorrowResponseDTO> result = borrowingService.getAllReturned();

        return ResponseEntity.ok(ApiResponse.<List<LibrarianBorrowResponseDTO>>builder()
                .code(200)
                .message("Lấy danh sách sách đã trả thành công")
                .result(result)
                .build());
    }
}