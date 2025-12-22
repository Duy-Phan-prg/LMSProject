package com.Library.lmsproject.controller;



import com.Library.lmsproject.dto.request.BorrowRequestDTO;
import com.Library.lmsproject.security.CustomUserDetails;
import com.Library.lmsproject.service.BorrowingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api/borrowings")
@RequiredArgsConstructor
public class BorrowingController {

    private final BorrowingService borrowingService;

    @PostMapping
    public ResponseEntity<?> borrowBook(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody BorrowRequestDTO request
    ) {
        Long userId = userDetails.getId();
        borrowingService.borrowBook(userId, request);
        return ResponseEntity.ok("Borrow success");
    }

}
