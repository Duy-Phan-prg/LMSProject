package com.Library.lmsproject.controller;

import com.Library.lmsproject.dto.request.UserCreateBorrowRequestDTO;
import com.Library.lmsproject.dto.response.ApiResponse;
import com.Library.lmsproject.dto.response.LibrarianBorrowResponseDTO;
import com.Library.lmsproject.dto.response.UserBorrowResponseDTO;
import com.Library.lmsproject.entity.BorrowStatus;
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