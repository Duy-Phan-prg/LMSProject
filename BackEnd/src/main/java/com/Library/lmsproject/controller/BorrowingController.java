package com.Library.lmsproject.controller;



import com.Library.lmsproject.dto.request.CreateBorrowRequestDTO;
import com.Library.lmsproject.dto.response.BorrowResponseDTO;
import com.Library.lmsproject.security.CustomUserDetails;
import com.Library.lmsproject.service.BorrowingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/borrowings")
@RequiredArgsConstructor
public class BorrowingController {

    private final BorrowingService borrowingService;

    @PostMapping("/borrow")
    public ResponseEntity<BorrowResponseDTO> borrowBook(
            @RequestParam Long userId,
            @RequestBody CreateBorrowRequestDTO request
    ) {
        BorrowResponseDTO response = borrowingService.borrowBook(userId, request);
        return ResponseEntity.ok(response);
    }

}
